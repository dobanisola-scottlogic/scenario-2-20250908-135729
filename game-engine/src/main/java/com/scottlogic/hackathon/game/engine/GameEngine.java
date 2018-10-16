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
import com.scottlogic.hackathon.game.engine.maps.PlayableMap;
import com.scottlogic.hackathon.game.engine.models.BotExceptionRejection;
import com.scottlogic.hackathon.game.engine.models.CollectableImpl;
import com.scottlogic.hackathon.game.engine.models.DisqualifiedBotImpl;
import com.scottlogic.hackathon.game.engine.models.GameResultImpl;
import com.scottlogic.hackathon.game.engine.models.MapImpl;
import com.scottlogic.hackathon.game.engine.models.MoveRejection;
import com.scottlogic.hackathon.game.engine.models.PlayerImpl;
import com.scottlogic.hackathon.game.engine.models.SimpleRejection;
import com.scottlogic.hackathon.game.engine.models.SpawnPointImpl;
import com.scottlogic.hackathon.game.engine.models.builders.GameStateBuilder;
import com.scottlogic.hackathon.game.engine.models.builders.PhaseResultBuilder;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;
import java.util.Random;
import java.util.Set;
import java.util.UUID;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.Executor;
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
    private TrackedSetImpl<PlayerImpl> players;
    private TrackedSetImpl<CollectableImpl> collectables;
    private TrackedSetImpl<SpawnPointImpl> spawnPoints;
    private TrackedSetImpl<DisqualifiedBotImpl> disqualifiedBots;
    private int phase;
    private final Executor executor;
    private final Runnable onDispose;

    private GameEngine(final PlayableMap map, final Set<Bot> bots, Executor executor, Runnable onDispose) {
        this.map = map;
        this.bots = bots;
        this.executor = executor;
        this.onDispose = onDispose;
    }

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

        if(debug) {
            return new GameEngine(map, bots, Runnable::run, () -> {});
        } else {
            ExecutorService executorService = Executors.newFixedThreadPool(bots.size());
            return new GameEngine(map, bots, executorService, executorService::shutdown);
        }
    }

    public PlayableMap getMap() {
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

        return new GameResultImpl(phaseResults, new MapImpl(map.getWidth(), map.getHeight()), map.getOutOfBoundsPositions(), cutoffCondition);
    }

    public void dispose() {
        onDispose.run();
    }

    private void initialiseBots() {
        invokeBots("initialise", initialiseTimeoutSeconds, exec -> bot -> gameState ->
                CompletableFuture.runAsync(() -> bot.initialise(gameState), exec).thenApply(v -> () -> {}))
        .run();
    }

    /**
     * Performs an action on each {@linkplain Bot} still in the game and its current associated {@linkplain GameState},
     * possibly in parallel. The action to be performed is specified as a function that takes a Bot,
     * its associated GameState, and an {@linkplain Executor}, and should return a {@linkplain CompletableFuture}
     * that produces a {@linkplain Runnable}. The resulting Runnable can be used to perform subsequent actions on the
     * results of the Bot invocation that must occur synchronously. They will be amalgamated into the returned Runnable.
     * <p>
     * The returned Runnable <b>must</b> be invoked at some point. This is because as well as amalgamating the runnables
     * produced successfully by the future of each Bot, it will also disqualify any Bots whose future completed
     * exceptionally, or did not complete within the specified timeout.
     *
     * @param fnName A string indicating the action each bot will be taking
     * @param timeout The maximum number of seconds each Bot's action will be allowed to run for
     *                (unless run synchronously)
     * @param fn A function to produce the future to run for each Bot and it's GameState, with the given executor
     * @return A runnable of amalgamated completion tasks, as described above
     */
    private Runnable invokeBots(String fnName, int timeout,
            Function<Executor, Function<Bot, Function<GameState, CompletableFuture<Runnable>>>> fn) {
        Function<Bot, Function<GameState, CompletableFuture<Runnable>>> f = fn.apply(executor);
        return getQualifyingBots().stream()
                .map(bot -> safeTimeout(bot, fnName, timeout, f.apply(bot).apply(createGameState(bot))))
                .reduce(CompletableFuture.completedFuture(()->{}),
                        (f1,f2) -> f1.thenCombine(f2, (r1,r2)->()->{r1.run(); r2.run();}))
                .join();
    }

    /**
     * Converts the given {@linkplain CompletableFuture} to one that <em>always</em> completes normally with a
     * non-{@code null} Runnable. The returned future's runnable will:
     * <ul>
     *     <li>
     *         be the same as that from the given future, if it completes normally within the given timeout.
     *     </li>
     *     <li>
     *         disqualify the given bot, if the given future completes exceptionally,
     *         or is not complete after the specified timeout.
     *     </li>
     * </ul>
     *
     * @param bot The bot to disqualify if the future doesn't complete normally
     * @param fnName A string indicating the action the given future should be taking
     * @param timeoutSeconds The number of seconds the given future should be allowed to run
     * @param future The future to convert
     * @return The converted future
     */
    private CompletableFuture<Runnable> safeTimeout(Bot bot, String fnName, int timeoutSeconds,
            CompletableFuture<Runnable> future) {
        return future
                .exceptionally(ex -> {
                    LOGGER.info("Bot threw exception.", ex);
                    return () -> disqualifyBot(bot, Arrays.asList(new BotExceptionRejection(ex)));
                })
                .orTimeout(timeoutSeconds, TimeUnit.SECONDS)
                .exceptionally(ex -> () ->
                        disqualifyBot(bot, Arrays.asList(new SimpleRejection(fnName + " took too long"))));
    }

    private void disqualifyBot(final Bot bot, final List<Rejection> rejectedMoves) {
        final DisqualifiedBotImpl disqualifiedBot = new DisqualifiedBotImpl(bot, rejectedMoves);
        disqualifiedBots.add(disqualifiedBot);
        removeIf(players, player -> player.getOwner().equals(bot.getId()));
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

        Map<UUID, PlayerImpl> uuidPlayerMap = Collections.unmodifiableMap(players.stream()
                .collect(Collectors.toMap(Player::getId, Function.identity(), (a,b) -> a)));

        Runnable applyMoves = invokeBots("makeMoves", makeMovesTimeoutSeconds, exec -> bot -> gameState ->
                CompletableFuture.supplyAsync(() -> bot.makeMoves(gameState), exec)
                        .thenApply(moves -> () -> {
                            List<Rejection> rejectedMoves = getRejectedMoves(bot, moves, uuidPlayerMap);
                            if(rejectedMoves.isEmpty()) {
                                applyMoves(moves, uuidPlayerMap);
                            } else {
                                disqualifyBot(bot, rejectedMoves);
                            }
                        }));

        players.reset();
        collectables.reset();
        spawnPoints.reset();

        applyMoves.run();

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
            UUID[] box = new UUID[1];
            if(players.stream().map(Player::getOwner)
                    .sequential()
                    .allMatch(id -> id.equals(box[0] = Objects.requireNonNullElse(box[0], id)))) {
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
        final HashSet<Bot> bots = new HashSet<>(this.bots);
        for (final DisqualifiedBotImpl disqualifiedBot : disqualifiedBots) {
            bots.remove((disqualifiedBot.getBot()));
        }
        return bots;
    }

    private static List<Rejection> getRejectedMoves(Bot bot, List<Move> moves, Map<UUID,? extends Player> playerIdMap) {
        Map<UUID, Move> playerMoves = new HashMap<>();
        List<Rejection> rejections = new ArrayList<>();

        for(Move move: moves) {
            UUID playerId = move.getPlayer();
            Player player = playerIdMap.get(playerId);
            if(player == null) {
                rejections.add(new MoveRejection(move, String.format("player %1s is unknown", move.getPlayer())));
            } else if(!player.getOwner().equals(bot.getId())) {
                rejections.add(new MoveRejection(move, String.format("player %1s is not owned by this bot", move.getPlayer())));
            } else if(playerMoves.putIfAbsent(playerId, move) != null) {
                new MoveRejection(move, String.format("player %1s can only move once per phase", move.getPlayer()));
            }
        }

        return rejections;
    }

    private void applyMoves(final List<Move> moves, Map<UUID, PlayerImpl> playerIdMap) {
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
        LOGGER.info("Player Spawned: " + player.toString());
        return player;
    }

    private void collideOutOfBoundsTiles() throws Exception {
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
            if(players.size() > 1) {
                players.stream()
                        .collect(Collectors.groupingBy(Player::getOwner))
                        .values()
                        .stream()
                        .filter(l -> l.size() > 1)
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
        actionOwnerAtItem(positionOwners, spawnPoints, (spawnPoint) -> spawnPoint.getPosition(), (owner, spawnPoint) -> {
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
        actionOwnerAtItem(positionOwners, collectables, collectable -> collectable.getPosition(), (owner, collectable) -> {
            boolean collected = false;
            if (collectable.getType() == Collectable.Type.PLAYER) {
                collected = collectPlayer(owner, collectable);
                LOGGER.info("Collectable Gathered By: " + owner);
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

    private <T> void actionOwnerAtItem(Map<Position, UUID> positionOwners, Iterable<? extends T> items,
            Function<T, Position> getPosition, BiConsumer<UUID, T> action) {
        for (final T item : items) {
            UUID owner = positionOwners.get(getPosition.apply(item));
            if(owner!=null) {
                action.accept(owner, item);
            }
        }
    }

}
