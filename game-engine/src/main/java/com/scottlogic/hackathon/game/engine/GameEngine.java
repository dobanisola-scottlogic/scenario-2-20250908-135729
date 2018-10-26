package com.scottlogic.hackathon.game.engine;

import com.scottlogic.hackathon.game.Bot;
import com.scottlogic.hackathon.game.Collectable;
import com.scottlogic.hackathon.game.CutoffCondition;
import com.scottlogic.hackathon.game.GameResult;
import com.scottlogic.hackathon.game.GameState;
import com.scottlogic.hackathon.game.Move;
import com.scottlogic.hackathon.game.PhaseResult;
import com.scottlogic.hackathon.game.Player;
import com.scottlogic.hackathon.game.Position;
import com.scottlogic.hackathon.game.Rejection;
import com.scottlogic.hackathon.game.SpawnPoint;
import com.scottlogic.hackathon.game.engine.maps.Arena;
import com.scottlogic.hackathon.game.engine.models.BotExceptionRejection;
import com.scottlogic.hackathon.game.engine.models.CollectableImpl;
import com.scottlogic.hackathon.game.engine.models.DisqualifiedBotImpl;
import com.scottlogic.hackathon.game.engine.models.GameResultImpl;
import com.scottlogic.hackathon.game.engine.models.GameMapImpl;
import com.scottlogic.hackathon.game.engine.models.MoveRejection;
import com.scottlogic.hackathon.game.engine.models.PlayerImpl;
import com.scottlogic.hackathon.game.engine.models.SimpleRejection;
import com.scottlogic.hackathon.game.engine.models.SpawnPointImpl;
import com.scottlogic.hackathon.game.engine.models.builders.GameStateBuilder;
import com.scottlogic.hackathon.game.engine.models.builders.PhaseResultBuilder;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.File;
import java.io.FileInputStream;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Properties;
import java.util.Random;
import java.util.Set;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.TimeUnit;
import java.util.function.BiConsumer;
import java.util.function.BiPredicate;
import java.util.function.Function;
import java.util.function.Predicate;
import java.util.stream.Collectors;
import java.util.stream.Stream;

public class GameEngine {
    private static final Logger LOGGER = LoggerFactory.getLogger(GameEngine.class);

    private final TimedConsumer<Bot> timedConsumer;
    private final Set<Bot> bots;
    private final Arena map;
    private final int maxPhases;
    private final int spawnPhases;
    private final int maxVisibleDistance;
    private final int maxCollectablesSpawnedPerPhase;
    private final int minCollectableDistanceFromSpawn;
    private final double collectablesSpawnFrequency;
    private final int battleRadius;
    private final int initialiseTimeoutSeconds;
    private final int makeMovesTimeoutSeconds;

    private TrackedSetImpl<PlayerImpl> players;
    private TrackedSetImpl<CollectableImpl> collectables;
    private TrackedSetImpl<SpawnPointImpl> spawnPoints;
    private TrackedSetImpl<DisqualifiedBotImpl> disqualifiedBots;
    private int phase;

    public static GameEngine create(String mapName, Set<Bot> bots) throws IllegalArgumentException {
        return create(mapName, bots, false);
    }

    public static GameEngine create(final String mapName, final Set<Bot> bots, boolean debug) throws IllegalArgumentException {
        if (bots.size() < 2) {
            throw new IllegalArgumentException("must have at least 2 bots");
        }

        final PlayableMap map;
        try {
            map = PlayableMap.load(mapName);
        } catch (final Exception ex) {
            throw new IllegalArgumentException("map wasn't found");
        }

        if (bots.size() > map.getSpawnPointPositions().size()) {
            throw new IllegalArgumentException("must have a spawn point for each bot");
        }

        final TimedConsumer<Bot> timedConsumer;
        if (debug) {
            timedConsumer = new TimedConsumer<>(Runnable::run, () -> {});
        } else {
            final ExecutorService executorService = Executors.newFixedThreadPool(bots.size());
            timedConsumer = new TimedConsumer<>(executorService, executorService::shutdown);
        }
        return new GameEngine(map, bots, timedConsumer);
    }

    private static Properties loadProperties() {
        String fileName = "config.properties";
        Properties props = new Properties();

        File file = new File(fileName);
        if(file.isFile()) {
            try (InputStream inputStream = new FileInputStream(file)) {
                props.load(inputStream);
            } catch (Exception e) {
                LOGGER.error("Error loading file config file: ", e);
            }
        }

        return props;
    }

    private static <T> T getConfigValue(Function<String, T> parseFunction, String fieldName, T defaultValue, Properties props) {
        T value = null;
        try {
            String property = props.getProperty(fieldName);

            if (property != null) {
                value = parseFunction.apply(property);
            }

        } catch (Exception e) {
            LOGGER.error("Error parsing config value: {}", fieldName, e);
        }

        return value != null ? value : defaultValue;
    }

    private GameEngine(final Arena map, final Set<Bot> bots, final TimedConsumer<Bot> timedConsumer) {
        this.map = map;
        this.bots = bots;
        this.timedConsumer = timedConsumer;

        Properties props = loadProperties();

        maxPhases = getConfigValue(Integer::parseInt, "maxPhases", 512, props);
        makeMovesTimeoutSeconds = getConfigValue(Integer::parseInt, "makeMovesTimeoutSeconds", 5 , props);
        collectablesSpawnFrequency = getConfigValue(Double::parseDouble, "collectablesSpawnFrequency", 0.2 , props);
        battleRadius = getConfigValue(Integer::parseInt, "battleRadius", 2 ,props);
        maxCollectablesSpawnedPerPhase = getConfigValue(Integer::parseInt, "maxCollectablesSpawnedPerPhase", 4 , props);
        minCollectableDistanceFromSpawn = getConfigValue(Integer::parseInt, "minCollectableDistanceFromSpawn", 8 , props);
        spawnPhases = getConfigValue(Integer::parseInt, "spawnPhases", 8 , props);
        initialiseTimeoutSeconds = getConfigValue(Integer::parseInt, "initialiseTimeoutSeconds", 30 , props);
        maxVisibleDistance = getConfigValue(Integer::parseInt, "maxVisibleDistance", 6 , props);
    }

    public Arena getMap() {
        return map;
    }

    /**
     * Runs the game simulation.
     *
     * @return The result of running the game simulation
     */
    public GameResult play() throws Exception {
        return play((a,b) -> true);
    }

    /**
     * Runs the game simulation.
     * <p>
     * The given callback will be invoked after each phase of the game, with the result of the previously run phase,
     * and an {@linkplain Optional} that will contain the {@linkplain CutoffCondition} if the game has ended.
     * If the callback returns {@code false}, the simulation will be cut short.
     *
     * @param phaseCallback A callback to be invoked after each phase completes
     * @return The result of running the game simulation
     */
    public GameResult play(BiPredicate<PhaseResult, Optional<CutoffCondition>> phaseCallback) throws Exception {
        players = new TrackedSetImpl<>();
        collectables = new TrackedSetImpl<>();
        spawnPoints = new TrackedSetImpl<>();
        disqualifiedBots = new TrackedSetImpl<>();
        phase = 0;

        LOGGER.info("Game Started");

        initialiseBots();
        createSpawnPoints();

        final List<PhaseResult> phaseResults = new ArrayList<>(maxPhases);

        spawn();

        final PhaseResult initialPhaseResult = createPhaseResult();
        phaseResults.add(initialPhaseResult);

        CutoffCondition cutoffCondition;
        do {
            final PhaseResult phaseResult = playPhase();
            phaseResults.add(phaseResult);
            cutoffCondition = getCutoffCondition();
            if(!phaseCallback.test(phaseResult, Optional.ofNullable(cutoffCondition)) && cutoffCondition==null) {
                cutoffCondition = CutoffCondition.CLIENT_QUIT;
            }
        } while (cutoffCondition == null);

        LOGGER.info("Cut Off Condition: " + cutoffCondition);

        return new GameResultImpl(phaseResults, new GameMapImpl(map.getWidth(), map.getHeight()), map.getOutOfBoundsPositions(), cutoffCondition);
    }

    public void dispose() {
        timedConsumer.dispose();
    }

    private void initialiseBots() throws InterruptedException, ExecutionException {
        final Map<Bot, GameState> botToGameStateMap = new ConcurrentHashMap<>(bots.size());
        for (final Bot bot : bots) {
            botToGameStateMap.put(bot, createGameState(bot));
        }

        final Set<TimedConsumer.Result<Bot>> consumeResults = timedConsumer.consume(bot ->
                bot.initialise(botToGameStateMap.get(bot)),
                bots,
                initialiseTimeoutSeconds,
                TimeUnit.SECONDS
        );

        consumeResults.stream()
                .filter(consumeResult -> !consumeResult.isCompleted())
                .forEach(consumeResult -> disqualifyBot(
                        consumeResult.getItem(),
                        Collections.singletonList(new SimpleRejection("initialise took too long"))
                ));
    }

    private void disqualifyBot(final Bot bot, final List<Rejection> rejectedMoves) {
        final DisqualifiedBotImpl disqualifiedBot = new DisqualifiedBotImpl(bot, rejectedMoves);
        disqualifiedBots.add(disqualifiedBot);
        removeIf(players, player -> player.getOwner().equals(bot.getId()));
        removeIf(spawnPoints, spawnPoint -> spawnPoint.getOwner().equals(bot.getId()));
        LOGGER.info("Bot Disqualified: {} Due to: {}", bot.getDisplayName(), rejectedMoves);
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
        final Map<UUID, PlayerImpl> uuidPlayerMap = players.stream()
                .collect(Collectors.toMap(Player::getId, Function.identity(), (a,b) -> a));

        players.reset();
        collectables.reset();
        spawnPoints.reset();

        final Map<Bot, List<Move>> botMoves = new ConcurrentHashMap<>(bots.size());
        final Set<TimedConsumer.Result<Bot>> consumeResults = timedConsumer.consume(bot -> {
            final GameState gameState = botToGameStateMap.get(bot);
            final List<Move> moves = bot.makeMoves(gameState);
            botMoves.put(bot, moves);
        }, bots, makeMovesTimeoutSeconds, TimeUnit.SECONDS);

        processBotMoveResults(consumeResults, botMoves, uuidPlayerMap);

        collideOutOfBoundsTiles();
        collideOwnPlayers();
        battlePlayers();

        // There should now be no more than 1 player at any position
        Map<Position, UUID> positionOwners = players.stream()
                .collect(Collectors.toMap(Player::getPosition, Player::getOwner));

        collideSpawnPoints(positionOwners);
        collect(positionOwners);
        spawn();

        final PhaseResult phaseResult = createPhaseResult();

        phase++;
        LOGGER.info("Phase Number: " + phase);

        return phaseResult;
    }

    private void processBotMoveResults(
            final Set<TimedConsumer.Result<Bot>> consumeResults,
            final Map<Bot, List<Move>> botMoves,
            final Map<UUID, PlayerImpl> uuidPlayerMap
    ) {
        consumeResults.forEach(consumeResult -> {
            final Bot bot = consumeResult.getItem();
            final Exception exception = consumeResult.getException();
            if (exception != null) {
                LOGGER.info("Bot threw exception.", exception);
                disqualifyBot(bot, Collections.singletonList(new BotExceptionRejection(exception)));
            } else if (!consumeResult.isCompleted()) {
                disqualifyBot(bot, Collections.singletonList(new SimpleRejection("makeMoves took too long")));
            } else {
                final List<Move> moves = botMoves.get(bot);
                final List<Rejection> rejectedMoves = getRejectedMoves(bot, moves, uuidPlayerMap);

                if (rejectedMoves.size() > 0) {
                    disqualifyBot(bot, rejectedMoves);
                } else {
                    applyMoves(moves, uuidPlayerMap);
                }
            }
        });
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
                .setMap(new GameMapImpl(map.getWidth(), map.getHeight()));

        final Set<Player> ownPlayers = getOwnedItems(players.stream(), player -> player.getOwner() == bot.getId());

        final Set<Position> visiblePositions = ownPlayers
                .stream()
                .map(Player::getPosition)
                .flatMap(position -> map.getSurroundingPositions(position, maxVisibleDistance))
                .collect(Collectors.toSet());

        gameStateBuilder
                .setOutOfBoundsPositions(getVisibleItems(visiblePositions, map.getOutOfBoundsPositions().stream(), Function.identity()))
                .setPlayers(getVisibleItemsOrOwnedItems(visiblePositions,
                        players.stream(),
                        Player::getPosition,
                        player -> player.getOwner().equals(bot.getId())))
                .setCollectables(getVisibleItems(visiblePositions, collectables.stream(), Collectable::getPosition))
                .setSpawnPoints(getVisibleItemsOrOwnedItems(visiblePositions,
                        spawnPoints.stream(),
                        SpawnPoint::getPosition,
                        spawnPoint -> spawnPoint.getOwner().equals(bot.getId())))
                .setRemovedPlayers(getOwnedItems(players.getRemoved().stream(), player -> player.getOwner().equals(bot.getId())))
                .setRemovedSpawnPoints(getOwnedItems(spawnPoints.getRemoved().stream(), spawnPoint -> spawnPoint.getOwner().equals(bot.getId())));

        return gameStateBuilder.createGameState();
    }

    private <T> Set<T> getVisibleItemsOrOwnedItems(final Set<Position> visiblePositions, final Stream<? extends T> items, final Function<T, Position> getPosition, final Predicate<T> isOwned) {
        return items
                .filter(item -> visiblePositions.contains(getPosition.apply(item)) || isOwned.test(item))
                .collect(Collectors.toSet());
    }

    private <T> Set<T> getOwnedItems(final Stream<? extends T> items, final Predicate<T> isOwned) {
        return items
                .filter(isOwned::test)
                .collect(Collectors.toSet());
    }

    private <T> Set<T> getVisibleItems(final Set<Position> visiblePositions, final Stream<? extends T> items, final Function<T, Position> getPosition) {
        return items
                .filter(item -> visiblePositions.contains(getPosition.apply(item)))
                .collect(Collectors.toSet());
    }

    private CutoffCondition getCutoffCondition() {
        return (phase > maxPhases)
                ? CutoffCondition.TURN_LIMIT_REACHED
                : (spawnPoints.size() == 0)
                        ? CutoffCondition.RANK_STABLE
                        : (players.stream().map(Player::getOwner).collect(Collectors.toSet()).size() < 2)
                                ? CutoffCondition.LONE_SURVIVOR
                                : null;
    }

    private void createSpawnPoints() {
        final List<Position> spawnPointPositions = new ArrayList<>(map.getSpawnPointPositions());
        Collections.shuffle(spawnPointPositions);

        final Iterator<Position> spawnPointPositionsIterator = spawnPointPositions.iterator();

        for (final Bot bot : bots) {
            final Position spawnPointPosition = spawnPointPositionsIterator.next();
            final SpawnPointImpl spawnPoint = new SpawnPointImpl(spawnPointPosition, bot.getId(), spawnPhases);
            spawnPoints.add(spawnPoint);
        }
    }

    private Set<Bot> getQualifyingBots() {
        final HashSet<Bot> bots = new HashSet<>(this.bots);
        for (final DisqualifiedBotImpl disqualifiedBot : disqualifiedBots) {
            bots.remove((disqualifiedBot.getBot()));
        }
        return bots;
    }

    private static List<Rejection> getRejectedMoves(Bot bot, List<Move> moves, Map<UUID,? extends Player> playerIdMap) {
        Map<UUID, Move> playerMoves = new HashMap<>();
        List<Rejection> rejections = new ArrayList<>();

        for (Move move : moves) {
            UUID playerId = move.getPlayer();
            Player player = playerIdMap.get(playerId);

            if (player == null) {
                rejections.add(
                        new MoveRejection(move, String.format("player %s is unknown", move.getPlayer()))
                );
            } else if (!player.getOwner().equals(bot.getId())) {
                rejections.add(
                        new MoveRejection(move, String.format("player %s is not owned by this bot", move.getPlayer()))
                );
            } else if (playerMoves.putIfAbsent(playerId, move) != null) {
                rejections.add(
                        new MoveRejection(move, String.format("player %s can only move once per phase", move.getPlayer()))
                );
            }
        }

        return rejections;
    }

    private void applyMoves(final List<Move> moves, Map<UUID, PlayerImpl> playerIdMap) {
        for (final Move move : moves) {
            final PlayerImpl player = playerIdMap.get(move.getPlayer());
            final Position position = map.getNeighbour(player.getPosition(), move.getDirection());
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

    private void spawnCollectable(final Collectable.Type type) {
        final Random random = new Random();

        final Set<Position> excludedPositions = Stream.concat(
                map.getOutOfBoundsPositions().stream(),
                Stream.concat(collectables.stream().map(CollectableImpl::getPosition),
                        spawnPoints.stream().map(SpawnPointImpl::getPosition)))
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
        } while (excludedPositions.contains(position) || tooCloseToSpawnPoint(position, minCollectableDistanceFromSpawn));

        final CollectableImpl collectable = new CollectableImpl(type, position);
        collectables.add(collectable);
    }

    private boolean tooCloseToSpawnPoint(final Position source, final int distance) {
        return spawnPoints
                .stream()
                .anyMatch(spawnPoint -> map.distance(source, spawnPoint.getPosition()) <= distance);
    }

    private void spawnPlayers() {
        for (final SpawnPointImpl spawnPoint : spawnPoints) {
            if (spawnPoint.shouldSpawnPlayer()) {
                spawnPlayer(spawnPoint);
            }
        }
    }

    private void spawnPlayer(final SpawnPoint spawnPoint) {
        final PlayerImpl player = new PlayerImpl(spawnPoint.getOwner(), spawnPoint.getPosition());
        players.add(player);
        LOGGER.info("Player Spawned: " + player.toString());
    }

    private void collideOutOfBoundsTiles() {
        final Set<PlayerImpl> playersToRemove = new HashSet<>();
        Set<Position> outOfBounds = map.getOutOfBoundsPositions();

        for(PlayerImpl player: players) {
            if(outOfBounds.contains(player.getPosition())) {
                playersToRemove.add(player);
            }
        }

        players.removeAll(playersToRemove);
    }

    private void collideOwnPlayers() {
        for (List<PlayerImpl> players: players.stream().collect(Collectors.groupingBy(Player::getPosition)).values()) {
            if (players.size() > 1) {
                players.stream()
                        .collect(Collectors.groupingBy(Player::getOwner))
                        .values()
                        .stream()
                        .filter(p -> p.size() > 1)
                        .forEach(this.players::removeAll);
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

    private void collideSpawnPoints(Map<Position, UUID> positionOwners) {
        final Set<SpawnPointImpl> spawnPointsToRemove = new HashSet<>();
        actionOwnerAtItem(positionOwners, spawnPoints, SpawnPoint::getPosition, (owner, spawnPoint) -> {
            if (owner != spawnPoint.getOwner()) {
                spawnPointsToRemove.add(spawnPoint);
                LOGGER.info("Spawn point captured: " + spawnPoint);
            }
        });
        if (spawnPoints.size() > 0) {
            spawnPoints.removeAll(spawnPointsToRemove);
        }
    }

    private void collect(Map<Position, UUID> positionOwners) {
        final Set<CollectableImpl> collectablesToRemove = new HashSet<>();
        actionOwnerAtItem(positionOwners, collectables, Collectable::getPosition, (owner, collectable) -> {
            if (collectable.getType() == Collectable.Type.PLAYER && collectPlayer(owner)) {
                collectablesToRemove.add(collectable);
                LOGGER.info("Collectable gathered by: " + owner);
            }
        });
        if (collectables.size() > 0) {
            collectables.removeAll(collectablesToRemove);
        }
    }

    private boolean collectPlayer(final UUID owner) {
        final Optional<SpawnPointImpl> spawnPoint = spawnPoints
                .stream()
                .filter(item -> item.getOwner().equals(owner))
                .findFirst();
        spawnPoint.ifPresent(SpawnPoint::queuePlayer);
        // Note: This means players of a bot without a spawn point can still collect food:
        return true;
    }

    private <T> void actionOwnerAtItem(
            Map<Position, UUID> positionOwners,
            Iterable<? extends T> items,
            Function<T, Position> getPosition,
            BiConsumer<UUID, T> action
    ) {
        UUID owner;
        for (final T item : items) {
            owner = positionOwners.get(getPosition.apply(item));
            if (owner != null) {
                action.accept(owner, item);
            }
        }
    }

}
