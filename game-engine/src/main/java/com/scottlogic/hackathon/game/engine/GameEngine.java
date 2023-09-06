package com.scottlogic.hackathon.game.engine;

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
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.CompletionException;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.Executor;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.ThreadFactory;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.TimeoutException;
import java.util.function.BiConsumer;
import java.util.function.BiFunction;
import java.util.function.BiPredicate;
import java.util.function.Function;
import java.util.function.Predicate;
import java.util.stream.Collectors;
import java.util.stream.Stream;
import lombok.Getter;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.scottlogic.hackathon.game.*;
import com.scottlogic.hackathon.game.engine.config.GameConfig;
import com.scottlogic.hackathon.game.engine.config.GameConfigLayer;
import com.scottlogic.hackathon.game.engine.maps.Arena;
import com.scottlogic.hackathon.game.engine.maps.FoodSpawnPositionPopulator;
import com.scottlogic.hackathon.game.engine.maps.MapLoadException;
import com.scottlogic.hackathon.game.engine.models.BotExceptionRejection;
import com.scottlogic.hackathon.game.engine.models.DisqualifiedBotImpl;
import com.scottlogic.hackathon.game.engine.models.GameResultImpl;
import com.scottlogic.hackathon.game.engine.models.MoveRejection;
import com.scottlogic.hackathon.game.engine.models.SimpleRejection;
import com.scottlogic.hackathon.game.engine.models.builders.GameStateBuilder;
import com.scottlogic.hackathon.game.engine.models.builders.PhaseResultBuilder;

public class GameEngine {
  private static final Logger LOGGER = LoggerFactory.getLogger(GameEngine.class);

  private final Executor executor;
  private final Runnable onShutdown;
  private final Set<Bot> bots;
  private final Arena map;
  private final GameConfig gameConfig;

  private final FoodPlacementStrategy foodPlacementStrategy;

  private TrackedSetImpl<Player> players;
  private TrackedSetImpl<Collectable> collectables;
  private TrackedSetImpl<SpawnPoint> spawnPoints;
  private TrackedSetImpl<DisqualifiedBotImpl> disqualifiedBots;
  private int phase;

  @Getter private ShortIdGenerator idGenerator;

  public static GameEngine createDebug(
      final GameConfigLayer forcedConfigOverrides, final Arena arena, final Set<Bot> bots) {
    return createInternal(forcedConfigOverrides, arena, bots, null, true);
  }

  public static GameEngine create(
      final GameConfigLayer forcedConfigOverrides, final Arena arena, final Set<Bot> bots) {
    return createInternal(
        forcedConfigOverrides, arena, bots, Executors.defaultThreadFactory(), false);
  }

  public static GameEngine create(
      final GameConfigLayer forcedConfigOverrides,
      final Arena arena,
      final Set<Bot> bots,
      ThreadFactory botThreadFactory) {
    return createInternal(
        forcedConfigOverrides, arena, bots, Objects.requireNonNull(botThreadFactory), false);
  }

  private static GameEngine createInternal(
      final GameConfigLayer forcedConfigOverrides,
      final Arena arena,
      final Set<Bot> bots,
      final ThreadFactory botThreadFactory,
      boolean isDebug)
      throws MapLoadException {

    final GameConfig aggregatedConfig =
        GameConfig.defaults
            .withOverrides(arena.getMapSpecificConfig())
            .withOverrides(forcedConfigOverrides)
            .withDebugMode(isDebug);

    final Arena postProcessedArena =
        new FoodSpawnPositionPopulator().populateFoodSpawnPositions(arena, aggregatedConfig);

    if (botThreadFactory == null) {
      return new GameEngine(
          new ShortIdGenerator(),
          postProcessedArena,
          bots,
          Runnable::run,
          () -> {},
          aggregatedConfig);
    } else {
      final ExecutorService executorService =
          Executors.newFixedThreadPool(bots.size(), botThreadFactory);
      return new GameEngine(
          new ShortIdGenerator(),
          postProcessedArena,
          bots,
          executorService,
          executorService::shutdown,
          aggregatedConfig);
    }
  }

  private GameEngine(
      final ShortIdGenerator idGenerator,
      final Arena arena,
      final Set<Bot> bots,
      final Executor executor,
      final Runnable onShutdown,
      final GameConfig gameConfig) {
    this.map = arena;
    this.bots = bots;
    this.executor = executor;
    this.onShutdown = onShutdown;
    this.gameConfig = gameConfig;
    this.foodPlacementStrategy = new FoodPlacementStrategy(arena);
    this.idGenerator = idGenerator;

    if (bots.size() < 2) {
      throw new IllegalArgumentException("must have at least 2 bots");
    }

    if (bots.size() > map.getSpawnPointPositions().size()) {
      throw new IllegalArgumentException("must have a spawn point for each bot");
    }
  }

  /**
   * Runs the game simulation.
   *
   * @return The result of running the game simulation
   */
  public GameResult play() throws Exception {
    return play((a, b) -> true);
  }

  /**
   * Runs the game simulation.
   *
   * <p>The given callback will be invoked after each phase of the game, with the result of the
   * previously run phase, and an {@linkplain Optional} that will contain the {@linkplain
   * CutoffCondition} if the game has ended. If the callback returns {@code false}, the simulation
   * will be cut short.
   *
   * @param phaseCallback A callback to be invoked after each phase completes
   * @return The result of running the game simulation
   */
  public GameResult play(BiPredicate<PhaseResult, Optional<CutoffCondition>> phaseCallback)
      throws InterruptedException {
    players = new TrackedSetImpl<>();
    collectables = new TrackedSetImpl<>();
    spawnPoints = new TrackedSetImpl<>();
    disqualifiedBots = new TrackedSetImpl<>();
    phase = 0;
    CutoffCondition cutoffCondition = null;

    LOGGER.info("Game Started");

    initialiseBots();
    createSpawnPoints();

    final List<PhaseResult> phaseResults = new ArrayList<>(gameConfig.getTurnLimit());

    if (spawnPoints.size() - disqualifiedBots.size() <= 1) {
      cutoffCondition = CutoffCondition.LONE_SURVIVOR;
    }

    spawn();

    final PhaseResult initialPhaseResult = createPhaseResult();
    phaseResults.add(initialPhaseResult);

    while (cutoffCondition == null) {
      final PhaseResult phaseResult = playPhase();
      phaseResults.add(phaseResult);
      cutoffCondition = getCutoffCondition();
      if (!phaseCallback.test(phaseResult, Optional.ofNullable(cutoffCondition))
          && cutoffCondition == null) {
        cutoffCondition = CutoffCondition.CLIENT_QUIT;
      }
    }

    LOGGER.info("Cut Off Condition: " + cutoffCondition);

    return new GameResultImpl(
        phaseResults, map.getGeometry(), map.getOutOfBoundsPositions(), cutoffCondition);
  }

  public void dispose() {
    onShutdown.run();
  }

  private void initialiseBots() throws InterruptedException {
    int initialiseTimeout =
        gameConfig.isDebugMode()
            ? gameConfig.getInitialiseDebugTimeoutMillis()
            : gameConfig.getInitialiseTimeoutMillis();
    invokeBots(
            "initialise",
            initialiseTimeout,
            (bot, gameState) -> {
              bot.initialise(gameState); // Run in parallel
              return () -> {}; // No post-processing required
            })
        .run();
  }

  /**
   * Invokes an action on all bots still in the game in parallel. This method blocks until the
   * action has been completed for all bots, or the time limit has been reached.
   *
   * <p>The actions is supplied in the form of a {@linkplain BiFunction} that takes a {@linkplain
   * Bot} and associated {@linkplain GameState}, and produces a {@linkplain Runnable}. The
   * BiFunction will run asynchronously as part of the parallel execution, but the resulting
   * runnable will <em>not</em>. Instead, the Runnables resulting from invoking the action on each
   * bot are bundled together and encapsulated in the Runnable returned by this method.
   *
   * <p>The provided action should be careful not to change the state of this class, as it is not
   * thread safe. Instead, any state changes that should be made in response to the bots' actions
   * should occur in the Runnable that the action produces, which can be run synchronously after
   * this method returns.
   *
   * <p>The Runnable that this method returns <em>must</em> be run, even if the Runnables produced
   * by the bot action are no-ops. This is because the returned Runnable will also action the
   * disqualification of any bots whose actions threw exceptions or exceeded the specified time
   * limit.
   *
   * @param actionName A human-readable name for the action being invoked. Used for error reporting
   * @param timeout The number of milliseconds the action should be given to run for each bot
   * @param action The action to take on each bot
   * @return A {@linkplain Runnable} that will perform any post-processing required of the actions,
   *     as described above
   * @throws InterruptedException If the current thread is interrupted while waiting for the actions
   *     to complete
   */
  private Runnable invokeBots(
      String actionName, int timeout, BiFunction<Bot, GameState, Runnable> action)
      throws InterruptedException {
    Map<Bot, CompletableFuture<Runnable>> actions =
        getQualifyingBots().stream()
            .collect(
                Collectors.toMap(
                    Function.identity(),
                    bot -> {
                      GameState gs = createGameState(bot);
                      return CompletableFuture.supplyAsync(() -> action.apply(bot, gs), executor)
                          .exceptionally(
                              ex ->
                                  () ->
                                      disqualifyBot(
                                          bot,
                                          Arrays.asList(
                                              new BotExceptionRejection(
                                                  ex instanceof CompletionException
                                                      ? ex.getCause()
                                                      : ex))));
                    }));

    try {
      CompletableFuture.allOf(actions.values().toArray(new CompletableFuture[actions.size()]))
          .get(timeout, TimeUnit.MILLISECONDS);
    } catch (ExecutionException e) {
      throw new IllegalStateException("Impossible exception thrown.", e.getCause());
    } catch (TimeoutException e) {
      actions.forEach(
          (bot, f) -> {
            // The below commands are both no-ops if the future is already complete
            f.complete(
                () ->
                    disqualifyBot(
                        bot, Arrays.asList(new SimpleRejection(actionName + " took too long"))));
            f.cancel(true); // TODO kill thread properly (see GH issue 64)
          });
    }

    assert actions.values().stream().allMatch(CompletableFuture::isDone);

    return actions.values().stream()
        .map(CompletableFuture::join)
        .reduce(
            (r1, r2) ->
                () -> {
                  r1.run();
                  r2.run();
                })
        .orElse(() -> {});
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

  private PhaseResult playPhase() throws InterruptedException {

    final Map<Id, Player> idPlayerMap =
        players.stream().collect(Collectors.toMap(Player::getId, Function.identity(), (a, b) -> a));

    int makeMovesTimeOut =
        gameConfig.isDebugMode()
            ? gameConfig.getMakeMovesDebugTimeoutMillis()
            : gameConfig.getMakeMovesTimeoutMillis();

    Runnable applyMovesToAllBots =
        invokeBots(
            "makeMoves",
            makeMovesTimeOut,
            (bot, gameState) -> {
              List<Move> moves = bot.makeMoves(gameState); // Run in parallel
              return () -> { // Reject and apply moves as part of synchronous post-processing, run
                // <BELOW>
                List<Rejection> rejectedMoves = getRejectedMoves(bot, moves, idPlayerMap);
                if (!rejectedMoves.isEmpty()) {
                  disqualifyBot(bot, rejectedMoves);
                } else {
                  applyMoves(moves, idPlayerMap);
                }
              };
            });

    players.reset();
    collectables.reset();
    spawnPoints.reset();

    applyMovesToAllBots.run(); // <BELOW>

    collideOutOfBoundsTiles();
    collideOwnPlayers();
    battlePlayers();

    // There should now be no more than 1 player at any position
    Map<Position, Id> positionOwners =
        players.stream().collect(Collectors.toMap(Player::getPosition, Player::getOwner));

    collideSpawnPoints(positionOwners);
    collect(positionOwners);
    spawn();

    final PhaseResult phaseResult = createPhaseResult();

    phase++;
    LOGGER.debug("Phase Number: " + phase);

    return phaseResult;
  }

  private PhaseResult createPhaseResult() {
    final PhaseResultBuilder phaseResultBuilder =
        new PhaseResultBuilder()
            .setPhase(phase)
            .setPlayers(new TrackedSetImpl<>(players))
            .setSpawnPoints(new TrackedSetImpl<>(spawnPoints))
            .setCollectables(new TrackedSetImpl<>(collectables))
            .setDisqualifiedBots(new TrackedSetImpl<>(disqualifiedBots));

    return phaseResultBuilder.createPhaseResult();
  }

  private GameState createGameState(final Bot bot) {
    final GameStateBuilder gameStateBuilder =
        new GameStateBuilder().setPhase(phase).setMap(map.getGeometry());

    final Set<Player> ownPlayers =
        getOwnedItems(players.stream(), player -> player.getOwner() == bot.getId());

    final Set<Position> visiblePositions =
        ownPlayers.stream()
            .map(Player::getPosition)
            .flatMap(
                position ->
                    map.getGeometry()
                        .getSurroundingPositions(position, gameConfig.getViewDistance()))
            .collect(Collectors.toSet());

    gameStateBuilder
        .setOutOfBoundsPositions(
            getVisibleItems(
                visiblePositions, map.getOutOfBoundsPositions().stream(), Function.identity()))
        .setPlayers(
            getVisibleItemsOrOwnedItems(
                visiblePositions,
                players.stream(),
                Player::getPosition,
                player -> player.getOwner().equals(bot.getId())))
        .setCollectables(
            getVisibleItems(visiblePositions, collectables.stream(), Collectable::getPosition))
        .setSpawnPoints(
            getVisibleItemsOrOwnedItems(
                visiblePositions,
                spawnPoints.stream(),
                SpawnPoint::getPosition,
                spawnPoint -> spawnPoint.getOwner().equals(bot.getId())))
        .setRemovedPlayers(
            getOwnedItems(
                players.getRemoved().stream(), player -> player.getOwner().equals(bot.getId())))
        .setRemovedSpawnPoints(
            getOwnedItems(
                spawnPoints.getRemoved().stream(),
                spawnPoint -> spawnPoint.getOwner().equals(bot.getId())));

    return gameStateBuilder.createGameState();
  }

  private <T> Set<T> getVisibleItemsOrOwnedItems(
      final Set<Position> visiblePositions,
      final Stream<? extends T> items,
      final Function<T, Position> getPosition,
      final Predicate<T> isOwned) {
    return items
        .filter(item -> visiblePositions.contains(getPosition.apply(item)) || isOwned.test(item))
        .collect(Collectors.toSet());
  }

  private <T> Set<T> getOwnedItems(final Stream<? extends T> items, final Predicate<T> isOwned) {
    return items.filter(isOwned::test).collect(Collectors.toSet());
  }

  private <T> Set<T> getVisibleItems(
      final Set<Position> visiblePositions,
      final Stream<? extends T> items,
      final Function<T, Position> getPosition) {
    return items
        .filter(item -> visiblePositions.contains(getPosition.apply(item)))
        .collect(Collectors.toSet());
  }

  private CutoffCondition getCutoffCondition() {
    if (phase > gameConfig.getTurnLimit()) {
      return CutoffCondition.TURN_LIMIT_REACHED;
    }

    if (spawnPoints.size() == 0) {
      return CutoffCondition.RANK_STABLE;
    }

    if (players.stream().map(Player::getOwner).collect(Collectors.toSet()).size() < 2) {
      return CutoffCondition.LONE_SURVIVOR;
    }

    return null;
  }

  private void createSpawnPoints() {
    final List<Position> spawnPointPositions = new ArrayList<>(map.getSpawnPointPositions());
    Collections.shuffle(spawnPointPositions);

    final Iterator<Position> spawnPointPositionsIterator = spawnPointPositions.iterator();

    for (final Bot bot : bots) {
      final Position spawnPointPosition = spawnPointPositionsIterator.next();
      final SpawnPoint spawnPoint =
          new SpawnPoint(
              idGenerator.next(),
              spawnPointPosition,
              bot.getId(),
              gameConfig.getInitialUnitCount());
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

  private static List<Rejection> getRejectedMoves(
      Bot bot, List<Move> moves, Map<Id, ? extends Player> playerIdMap) {
    Map<Id, Move> playerMoves = new HashMap<>();
    List<Rejection> rejections = new ArrayList<>();

    for (Move move : moves) {
      Id playerId = move.getPlayer();
      Player player = playerIdMap.get(playerId);

      if (move.getDirection() == null) {
        rejections.add(new MoveRejection(move, "player in 'null' direction"));
      }

      if (player == null) {
        rejections.add(new MoveRejection(move, "unknown player"));
      } else if (!player.getOwner().equals(bot.getId())) {
        rejections.add(new MoveRejection(move, "player not owned by this bot"));
      } else if (playerMoves.putIfAbsent(playerId, move) != null) {
        rejections.add(new MoveRejection(move, "same player more than once per phase"));
      }
    }

    return rejections;
  }

  private void applyMoves(final List<Move> moves, Map<Id, Player> playerIdMap) {
    for (final Move move : moves) {
      final Player player = playerIdMap.get(move.getPlayer());
      final Position position =
          map.getGeometry().getNeighbour(player.getPosition(), move.getDirection());
      players.replace(player, player.move(position));
    }
  }

  private void spawn() {
    spawnPlayers();
    maybeSpawnFood();
  }

  private void maybeSpawnFood() {
    final Random random = new Random();

    if (random.nextDouble() >= gameConfig.getFoodSpawnProbability()) {
      return;
    }

    // generate a random count of food to spawn, but limit it so we don't go over the map's maximum
    final int idealSpawnAmount = 1 + random.nextInt(gameConfig.getMaxFoodSpawnedPerTurn() - 1);
    final int maximumAllowedSpawnAmount = gameConfig.getMaximumFoodCount() - collectables.size();
    final int amountToSpawn = Math.min(idealSpawnAmount, maximumAllowedSpawnAmount);

    spawnFood(amountToSpawn);
  }

  private void spawnFood(int count) {
    final Set<Position> excludedPositions =
        Stream.of(
                collectables.stream().map(Collectable::getPosition),
                players.stream().map(Player::getPosition),
                spawnPoints.stream()
                    .flatMap(
                        base ->
                            map.getGeometry()
                                .getSurroundingPositions(
                                    base.getPosition(),
                                    gameConfig.getMinFoodDistanceFromSpawn() - 1)))
            .flatMap(Function.identity())
            .collect(Collectors.toSet());

    foodPlacementStrategy
        .getRandomPositions(excludedPositions::contains)
        .limit(count)
        .forEach(
            position ->
                collectables.add(
                    new Collectable(idGenerator.next(), Collectable.Type.PLAYER, position)));
  }

  private void spawnPlayers() {
    for (final SpawnPoint spawnPoint : spawnPoints) {
      final Position spawnPosition = spawnPoint.getPosition();
      if (players.stream().anyMatch(p -> p.getPosition().equals(spawnPosition))) {
        continue; // the spawn position is blocked; don't spawn anything
      }

      spawnPoint
          .createPlayerIfAble(idGenerator.next())
          .ifPresent(
              p -> {
                players.add(p);
                LOGGER.debug("Player Spawned: " + p.toString());
              });
    }
  }

  private void collideOutOfBoundsTiles() {
    final Set<Player> playersToRemove = new HashSet<>();
    Set<Position> outOfBounds = map.getOutOfBoundsPositions();

    for (Player player : players) {
      if (outOfBounds.contains(player.getPosition())) {
        playersToRemove.add(player);
      }
    }

    players.removeAll(playersToRemove);
  }

  private void collideOwnPlayers() {
    for (List<Player> players :
        players.stream().collect(Collectors.groupingBy(Player::getPosition)).values()) {
      if (players.size() > 1) {
        players.stream().collect(Collectors.groupingBy(Player::getOwner)).values().stream()
            .filter(p -> p.size() > 1)
            .forEach(this.players::removeAll);
      }
    }
  }

  private void battlePlayers() {
    final BattleSystem battleSystem =
        new BattleSystem(players, map.getGeometry(), gameConfig.getBattleRadius());
    final Set<Player> deadPlayers = battleSystem.runBattle();

    if (deadPlayers.size() > 0) {
      this.players.removeAll(deadPlayers);
    }
  }

  private void collideSpawnPoints(Map<Position, Id> positionOwners) {
    final Set<SpawnPoint> spawnPointsToRemove = new HashSet<>();
    actionOwnerAtItem(
        positionOwners,
        spawnPoints,
        SpawnPoint::getPosition,
        (owner, spawnPoint) -> {
          if (owner != spawnPoint.getOwner()) {
            spawnPointsToRemove.add(spawnPoint);
            LOGGER.debug("Spawn point captured: " + spawnPoint);
          }
        });
    if (spawnPoints.size() > 0) {
      spawnPoints.removeAll(spawnPointsToRemove);
    }
  }

  private void collect(Map<Position, Id> positionOwners) {
    final Set<Collectable> collectablesToRemove = new HashSet<>();
    actionOwnerAtItem(
        positionOwners,
        collectables,
        Collectable::getPosition,
        (owner, collectable) -> {
          if (collectable.getType() == Collectable.Type.PLAYER && collectPlayer(owner)) {
            collectablesToRemove.add(collectable);
            LOGGER.debug("Collectable gathered by: " + owner);
          }
        });
    if (collectables.size() > 0) {
      collectables.removeAll(collectablesToRemove);
    }
  }

  private boolean collectPlayer(final Id owner) {
    final Optional<SpawnPoint> spawnPoint =
        spawnPoints.stream().filter(item -> item.getOwner().equals(owner)).findFirst();
    spawnPoint.ifPresent(SpawnPoint::queuePlayer);
    // Note: This means players of a bot without a spawn point can still collect food:
    return true;
  }

  private <T> void actionOwnerAtItem(
      Map<Position, Id> positionOwners,
      Iterable<? extends T> items,
      Function<T, Position> getPosition,
      BiConsumer<Id, T> action) {
    Id owner;
    for (final T item : items) {
      owner = positionOwners.get(getPosition.apply(item));
      if (owner != null) {
        action.accept(owner, item);
      }
    }
  }
}
