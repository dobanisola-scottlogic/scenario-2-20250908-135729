package com.scottlogic.hackathon.game.engine;

import com.scottlogic.hackathon.game.*;
import com.scottlogic.hackathon.game.engine.maps.PlayableMap;
import com.scottlogic.hackathon.game.engine.models.*;
import com.scottlogic.hackathon.game.engine.models.builders.GameStateBuilder;
import com.scottlogic.hackathon.game.engine.models.builders.PhaseResultBuilder;

import java.util.*;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.TimeUnit;
import java.util.function.Function;
import java.util.function.Predicate;
import java.util.stream.Collectors;
import java.util.stream.Stream;

public class GameEngine {
    private final Set<Bot> bots;
    private final PlayableMap map;
    private final int maxPhases = 512;
    private final int spawnPhases = 8;
    private final int maxVisibleDistance = 6;
    private final int maxCollectablesSpawnedPerPhase = 4;
    private final int minCollectableDistanceFromSpawn = 8;
    private final double collectablesSpawnFrequency = 0.2;
    private final int battleRadius = 2;
    private final int initialiseTimeoutSeconds = 30;
    private final int makeMovesTimeoutSeconds = 5;
    private final TimedConsumer<Bot> timedConsumer = new TimedConsumer<Bot>();
    Map<Bot, GameStateImpl> gamesStates = new HashMap<Bot, GameStateImpl>();
    private TrackedSetImpl<PlayerImpl> players;
    private TrackedSetImpl<CollectableImpl> collectables;
    private TrackedSetImpl<SpawnPointImpl> spawnPoints;
    private TrackedSetImpl<DisqualifiedBotImpl> disqualifiedBots;
    private int phase;

    public GameEngine(final PlayableMap map, final Set<Bot> bots) throws IllegalArgumentException {
        this.map = map;
        this.bots = bots;

        if (bots.size() <= 1) {
            throw new IllegalArgumentException("must have at least 2 bots");
        }

        if (bots.size() > map.getSpawnPointPositions().size()) {
            throw new IllegalArgumentException("must have a spawn point for each bot");
        }
    }

    public static GameEngine create(final String mapName, final Set<Bot> bots) throws IllegalArgumentException {
        final PlayableMap map;
        try {
            map = PlayableMap.load(mapName);
        } catch (final Exception ex) {
            throw new IllegalArgumentException("map wasn't found");
        }
        return new GameEngine(map, bots);
    }

    public GameResult play() throws Exception {
        players = new TrackedSetImpl<PlayerImpl>();
        collectables = new TrackedSetImpl<CollectableImpl>();
        spawnPoints = new TrackedSetImpl<SpawnPointImpl>();
        disqualifiedBots = new TrackedSetImpl<DisqualifiedBotImpl>();
        phase = 0;

        initialiseBots();
        createSpawnPoints();

        final List<PhaseResult> phaseResults = new ArrayList<PhaseResult>(maxPhases);

        spawn();

        final PhaseResult initialPhaseResult = createPhaseResult();
        phaseResults.add(initialPhaseResult);

        CutoffCondition cutoffCondition;
        do {
            final PhaseResult phaseResult = playPhase();
            phaseResults.add(phaseResult);
            cutoffCondition = getCutoffCondition();
        } while (cutoffCondition == null);

        return new GameResultImpl(phaseResults, new MapImpl(map.getWidth(), map.getHeight()), map.getOutOfBoundsPositions(), cutoffCondition);
    }

    private void initialiseBots() throws InterruptedException, ExecutionException {
        final Map<Bot, GameState> botToGameStateMap = new ConcurrentHashMap<>(bots.size());
        for (final Bot bot : bots) {
            botToGameStateMap.put(bot, createGameState(bot));
        }

        final Set<TimedConsumer.Result<Bot>> consumeResults = timedConsumer.consume(bot -> {
            final GameState gameState = botToGameStateMap.get(bot);
            bot.initialise(gameState);
        }, bots, initialiseTimeoutSeconds, TimeUnit.SECONDS);

        consumeResults.stream()
                .filter(consumeResult -> !consumeResult.isCompleted())
                .forEach(consumeResult -> {
                    disqualifyBot(consumeResult.getItem(), Arrays.asList(new BotRejection("initialise took too long")));
                });
    }

    private void disqualifyBot(final Bot bot, final List<Rejection> rejectedMoves) {
        final DisqualifiedBotImpl disqualifiedBot = new DisqualifiedBotImpl(bot, rejectedMoves);
        disqualifiedBots.add(disqualifiedBot);
        removeIf(players, player -> player.getOwner().equals(bot.getId()));
        removeIf(players, player -> player.getOwner().equals(bot.getId()));
        removeIf(spawnPoints, spawnPoint -> spawnPoint.getOwner().equals(bot.getId()));
    }

    private <T> void removeIf(final TrackedSetImpl<T> items, final Predicate<T> predicate) {
        for (final Iterator<T> iterator = items.iterator(); iterator.hasNext(); ) {
            final T item = iterator.next();
            if (predicate.test(item)) {
                iterator.remove();
            }
        }
    }

    private PhaseResult playPhase() throws Exception {
        final Set<Bot> bots = getQualifyingBots();

        final Map<Bot, GameState> botToGameStateMap = new ConcurrentHashMap<>(bots.size());
        for (final Bot bot : bots) {
            botToGameStateMap.put(bot, createGameState(bot));
        }

        players.reset();
        collectables.reset();
        spawnPoints.reset();


        final Map<Bot, List<Move>> botMoves = new ConcurrentHashMap<>(bots.size());
        final Set<TimedConsumer.Result<Bot>> consumeResults = timedConsumer.consume(bot -> {
            final GameState gameState = botToGameStateMap.get(bot);
            final List<Move> moves = bot.makeMoves(gameState);

            botMoves.put(bot, moves);
        }, bots, makeMovesTimeoutSeconds, TimeUnit.SECONDS);

        consumeResults
                .stream()
                .forEach(consumeResult -> {
                    final Bot bot = consumeResult.getItem();
                    if (!consumeResult.isCompleted()) {
                        disqualifyBot(bot, Arrays.asList(new BotRejection("makeMoves took too long")));

                    } else {
                        final List<Move> moves = botMoves.get(bot);
                        final List<Rejection> rejectedMoves = getRejectedMoves(bot, moves);

                        if (rejectedMoves.size() > 0) {
                            disqualifyBot(bot, rejectedMoves);
                        } else {
                            applyMoves(moves);
                        }
                    }
                });

        collide();
        collect();
        spawn();

        final PhaseResult phaseResult = createPhaseResult();

        phase++;

        return phaseResult;
    }

    private PhaseResult createPhaseResult() {
        final PhaseResultBuilder phaseResultBuilder = new PhaseResultBuilder()
                .setPhase(phase)
                .setPlayers(new TrackedSetImpl<>(players))
                .setSpawnPoints(new TrackedSetImpl<>(spawnPoints))
                .setCollectables(new TrackedSetImpl<>(collectables))
                .setDisqualifiedBots(new TrackedSetImpl<>(disqualifiedBots));

        return phaseResultBuilder.createPhaseResult();
    }

    private GameState createGameState(final Bot bot) {
        final GameStateBuilder gameStateBuilder = new GameStateBuilder()
                .setPhase(phase)
                .setMap(new MapImpl(map.getWidth(), map.getHeight()));

        final Set<Player> ownPlayers = getOwnedItems(players.stream(), player -> player.getOwner() == bot.getId());

        final Set<Position> visiblePositions = ownPlayers
                .stream()
                .map(player -> player.getPosition())
                .flatMap(position -> map.getSurroundingPositions(position, maxVisibleDistance, true))
                .distinct()
                .collect(Collectors.toSet());

        gameStateBuilder
                .setOutOfBoundsPositions(getVisibleItems(visiblePositions, map.getOutOfBoundsPositions().stream(), Function.identity()))
                .setPlayers(getVisibleItemsOrOwnedItems(visiblePositions,
                        players.stream(),
                        player -> player.getPosition(),
                        player -> player.getOwner().equals(bot.getId())))
                .setCollectables(getVisibleItems(visiblePositions, collectables.stream(), collectable -> collectable.getPosition()))
                .setSpawnPoints(getVisibleItemsOrOwnedItems(visiblePositions,
                        spawnPoints.stream(),
                        spawnPoint -> spawnPoint.getPosition(),
                        spawnPoint -> spawnPoint.getOwner().equals(bot.getId())))
                .setRemovedPlayers(getOwnedItems(players.getRemoved().stream(), player -> player.getOwner().equals(bot.getId())))
                .setRemovedSpawnPoints(getOwnedItems(spawnPoints.getRemoved().stream(), spawnPoint -> spawnPoint.getOwner().equals(bot.getId())));

        return gameStateBuilder.createGameState();
    }

    private <T> Set<T> getVisibleItemsOrOwnedItems(final Set<Position> visiblePositions, final Stream<? extends T> items, final Function<T, Position> getPosition, final Predicate<T> isOwned) {
        final Set<T> visibleItemsOrOwnedItems = items
                .filter(item -> visiblePositions.contains(getPosition.apply(item)) || isOwned.test(item))
                .collect(Collectors.toSet());
        return visibleItemsOrOwnedItems;
    }

    private <T> Set<T> getOwnedItems(final Stream<? extends T> items, final Predicate<T> isOwned) {
        final Set<T> ownedItems = items
                .filter(item -> isOwned.test(item))
                .collect(Collectors.toSet());
        return ownedItems;
    }

    private <T> Set<T> getVisibleItems(final Set<Position> visiblePositions, final Stream<? extends T> items, final Function<T, Position> getPosition) {
        final Set<T> visibleItems = items
                .filter(item -> visiblePositions.contains(getPosition.apply(item)))
                .collect(Collectors.toSet());
        return visibleItems;
    }

    private CutoffCondition getCutoffCondition() {
        CutoffCondition cutoffCondition = null;

        if (phase > maxPhases) {
            cutoffCondition = CutoffCondition.TURN_LIMIT_REACHED;
        } else if (spawnPoints.size() == 0) {
            cutoffCondition = CutoffCondition.RANK_STABLE;
        } else {
            final Map<UUID, Set<Player>> ownerToPlayerLookup = createLookup(players, player -> player.getOwner(), Function.identity());
            if (ownerToPlayerLookup.size() == 1) {
                cutoffCondition = CutoffCondition.LONE_SURVIVOR;
            }
        }

        return cutoffCondition;
    }

    private void createSpawnPoints() {
        final Random random = new Random();
        final List<Position> spawnPointPositions = map
                .getSpawnPointPositions()
                .stream()
                .collect(Collectors.toList());

        Collections.shuffle(spawnPointPositions);

        final Iterator<Position> spawnPointPositionsIterator = spawnPointPositions.iterator();

        for (final Bot bot : bots) {
            final Position spawnPointPosition = spawnPointPositionsIterator.next();
            final SpawnPointImpl spawnPoint = new SpawnPointImpl(spawnPointPosition, bot.getId(), spawnPhases);
            spawnPoints.add(spawnPoint);
        }
    }

    private Set<Bot> getQualifyingBots() {
        final HashSet<Bot> bots = new HashSet<Bot>(this.bots);
        for (final DisqualifiedBotImpl disqualifiedBot : disqualifiedBots) {
            bots.remove((disqualifiedBot.getBot()));
        }
        return bots;
    }

    private List<Rejection> getRejectedMoves(final Bot bot, final List<Move> moves) {
        final Map<UUID, Set<Move>> playerToMovesLookup = createLookup(moves, move -> move.getPlayer(), Function.identity());

        final Stream<Rejection> multipleMoves = playerToMovesLookup
                .values()
                .stream()
                .filter(playerMoves -> playerMoves.size() > 1)
                .flatMap(playerMoves -> playerMoves.stream())
                .map(move -> new MoveRejection(move, String.format("player %1s can only move once per phase", move.getPlayer())));

        final Map<UUID, Player> playerIdMap = createMap(players, player -> player.getId(), Function.identity());

        final Stream<Rejection> unknownPlayer = moves
                .stream()
                .filter(move -> !playerIdMap.containsKey(move.getPlayer()))
                .map(move -> new MoveRejection(move, String.format("player %1s is unknown", move.getPlayer())));

        final Stream<Rejection> unownedPlayer = moves
                .stream()
                .filter(move -> playerIdMap.containsKey(move.getPlayer()))
                .filter(move -> !playerIdMap.get(move.getPlayer()).getOwner().equals(bot.getId()))
                .map(move -> new MoveRejection(move, String.format("player %1s is not owned by this bot", move.getPlayer())));

        final List<Rejection> rejectedMoves = Stream.concat(Stream.concat(multipleMoves, unknownPlayer), unownedPlayer)
                .collect(Collectors.toList());

        return rejectedMoves;
    }

    private void applyMoves(final List<Move> moves) {
        final Map<UUID, PlayerImpl> playerIdMap = createMap(players, player -> player.getId(), Function.identity());

        for (final Move move : moves) {
            final PlayerImpl player = playerIdMap.get(move.getPlayer());
            final Position position = map.calculatePosition(player.getPosition(), move.getDirection());
            players.replace(player, player.move(position));
        }
    }

    private void spawn() {
        spawnPlayers();
        spawnCollectables();
    }

    private void spawnCollectables() {
        final Random random = new Random();
        final Collectable.Type[] types = Collectable.Type.values();
        for (final Collectable.Type type : types) {
            if (random.nextDouble() > collectablesSpawnFrequency) {
                final int count = random.nextInt(maxCollectablesSpawnedPerPhase);
                for (int i = 0; i < count; i++) {
                    spawnCollectable(type);
                }
            }
        }
    }

    private CollectableImpl spawnCollectable(final Collectable.Type type) {
        final Random random = new Random();

        final Set<Position> excludedPositions = Stream.concat(
                map.getOutOfBoundsPositions().stream(),
                Stream.concat(collectables.stream().map(collectable -> collectable.getPosition()),
                        spawnPoints.stream().map(spawnPoint -> spawnPoint.getPosition())))
                .distinct()
                .collect(Collectors.toSet());

        Position position;
        int attempts = 0;
        do {
            final int x = random.nextInt(map.getWidth());
            final int y = random.nextInt(map.getHeight());
            position = new Position(x, y);
            if (attempts++ > 100) {
                throw new RuntimeException("Too many positions are excluded to allow use to find a free position");
            }
        } while (excludedPositions.contains(position) || closeToSpawnPoint(position, minCollectableDistanceFromSpawn));

        final CollectableImpl collectable = new CollectableImpl(type, position);
        collectables.add(collectable);
        return collectable;
    }

    private boolean closeToSpawnPoint(final Position source, final int range) {
        return spawnPoints
                .stream()
                .anyMatch(spawnPoint -> map.distanceBetween(source, spawnPoint.getPosition()) <= range);
    }

    private void spawnPlayers() {
        for (final SpawnPointImpl spawnPoint : spawnPoints) {
            if (spawnPoint.shouldSpawnPlayer()) {
                spawnPlayer(spawnPoint);
            }
        }
    }

    private PlayerImpl spawnPlayer(final SpawnPoint spawnPoint) {
        final PlayerImpl player = new PlayerImpl(spawnPoint.getOwner(), spawnPoint.getPosition());
        players.add(player);
        return player;
    }

    private void collide() throws Exception {
        collideOutOfBoundsTiles();
        collideOwnPlayers();
        battlePlayers();
        collideSpawnPoints();
    }

    private void collideOutOfBoundsTiles() throws Exception {
        final Set<PlayerImpl> playersToRemove = new HashSet<PlayerImpl>();
        actionPlayersAtItem(map.getOutOfBoundsPositions(), Function.identity(), (players, outOfBoundsTile) -> {
            playersToRemove.addAll(players);
        });
        if (playersToRemove.size() > 0) {
            players.removeAll(playersToRemove);
        }
    }

    private void collideOwnPlayers() {
        final Map<Position, Set<PlayerImpl>> positionToPlayersLookup = createLookup(players, player -> player.getPosition(), Function.identity());

        for (final Set<PlayerImpl> players : positionToPlayersLookup.values()) {
            if (players.size() > 1) {
                final Map<UUID, Set<PlayerImpl>> ownerToPlayersLookup = createLookup(players, player -> player.getOwner(), Function.identity());

                for (final Set<PlayerImpl> ownedPlayers : ownerToPlayersLookup.values()) {
                    if (ownedPlayers.size() > 1) {
                        this.players.removeAll(ownedPlayers);
                    }
                }
            }
        }
    }

    private void battlePlayers() {
        final BattleSystem battleSystem = new BattleSystem(players, map, battleRadius);
        final Set<PlayerImpl> deadPlayers = battleSystem.runBattle();

        if (deadPlayers.size() > 0) {
            this.players.removeAll(deadPlayers);
        }
    }

    private void collideSpawnPoints() throws Exception {
        final Set<SpawnPointImpl> spawnPointsToRemove = new HashSet<SpawnPointImpl>();
        actionOwnerAtItem(spawnPoints, (spawnPoint) -> spawnPoint.getPosition(), (owner, spawnPoint) -> {
            if (owner != spawnPoint.getOwner()) {
                spawnPointsToRemove.add(spawnPoint);
            }
        });
        if (spawnPoints.size() > 0) {
            spawnPoints.removeAll(spawnPointsToRemove);
        }
    }

    private void collect() throws Exception {
        final Set<CollectableImpl> collectablesToRemove = new HashSet<CollectableImpl>();
        actionOwnerAtItem(collectables, collectable -> collectable.getPosition(), (owner, collectable) -> {
            boolean collected = false;
            if (collectable.getType() == Collectable.Type.PLAYER) {
                collected = collectPlayer(owner, collectable);
            }

            if (collected) {
                collectablesToRemove.add(collectable);
            }
        });
        if (collectables.size() > 0) {
            collectables.removeAll(collectablesToRemove);
        }
    }

    private boolean collectPlayer(final UUID owner, final CollectableImpl collectable) {
        final Optional<SpawnPointImpl> spawnPoint = spawnPoints
                .stream()
                .filter(item -> item.getOwner().equals(owner))
                .findFirst();
        if (spawnPoint.isPresent()) {
            spawnPoint.get().queuePlayer();
        }
        return true;
    }

    private <TItem, TKey, TValue> Map<TKey, Set<TValue>> createLookup(
            final Iterable<? extends TItem> items,
            final Function<TItem, TKey> keySelector,
            final Function<TItem, TValue> valueSelector) {
        final Map<TKey, Set<TValue>> lookup = new HashMap<TKey, Set<TValue>>();

        for (final TItem item : items) {
            final TKey key = keySelector.apply(item);
            final TValue value = valueSelector.apply(item);
            if (!lookup.containsKey(key)) {
                lookup.put(key, new HashSet<TValue>());
            }
            lookup.get(key).add(value);
        }
        return lookup;
    }

    private <TItem, TKey, TValue> Map<TKey, TValue> createMap(
            final Iterable<? extends TItem> items,
            final Function<TItem, TKey> keySelector,
            final Function<TItem, TValue> valueSelector) {
        final Map<TKey, TValue> map = new HashMap<TKey, TValue>();

        for (final TItem item : items) {
            final TKey key = keySelector.apply(item);
            final TValue value = valueSelector.apply(item);
            if (map.containsKey(key)) {

            }
            map.put(key, value);
        }
        return map;
    }

    private <T> void actionOwnerAtItem(final Iterable<? extends T> items, final Function<T, Position> getPosition, final ActionAtItemConsumer<UUID, T> action) throws Exception {
        actionPlayersAtItem(items, getPosition, (players, item) -> {
            final Set<UUID> owners = players.stream()
                    .map(player -> player.getOwner())
                    .collect(Collectors.toSet());
            if (owners.size() > 1) {
                throw new Exception("Players must have been collided first");
            } else if (owners.size() == 1) {
                final UUID owner = owners.iterator().next();
                action.accept(owner, item);
            }

        });
    }

    private <T> void actionPlayersAtItem(final Iterable<? extends T> items, final Function<T, Position> getPosition, final ActionAtItemConsumer<Set<PlayerImpl>, T> action) throws Exception {
        final Map<Position, Set<PlayerImpl>> positionToPlayersLookup = createLookup(players, player -> player.getPosition(), Function.identity());

        for (final T item : items) {
            final Position itemPosition = getPosition.apply(item);
            if (positionToPlayersLookup.containsKey(itemPosition)) {
                final Set<PlayerImpl> players = positionToPlayersLookup.get(itemPosition);
                action.accept(players, item);
            }
        }
    }

    @FunctionalInterface
    interface ActionAtItemConsumer<TFound, TItem> {
        void accept(TFound found, TItem item) throws Exception;
    }

}
