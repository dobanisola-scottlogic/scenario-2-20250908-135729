package com.scottlogic.hackathon.game.engine.config;

public class GameConfig {
  public static GameConfig defaults =
      new GameConfig(512, 3000, 2000, 300000, 120000, 0.8, 2, 4, 8, 8, 6, 999999999, false);

  private int turnLimit;
  private int makeMovesTimeoutMillis;
  private int initialiseTimeoutMillis;
  private int makeMovesDebugTimeoutMillis;
  private int initialiseDebugTimeoutMillis;
  private double foodSpawnProbability;
  private int battleRadius;
  private int maxFoodSpawnedPerTurn;
  private int minFoodDistanceFromSpawn;
  private int initialUnitCount;
  private int viewDistance;
  private int maximumFoodCount;
  private boolean debugMode;

  private GameConfig(
      int turnLimit,
      int makeMovesTimeoutMillis,
      int initialiseTimeoutMillis,
      int makeMovesDebugTimeoutMillis,
      int initialiseDebugTimeoutMillis,
      double foodSpawnProbability,
      int battleRadius,
      int maxFoodSpawnedPerTurn,
      int minFoodDistanceFromSpawn,
      int initialUnitCount,
      int viewDistance,
      int maximumFoodCount,
      boolean debugMode) {

    this.turnLimit = turnLimit;
    this.makeMovesTimeoutMillis = makeMovesTimeoutMillis;
    this.initialiseTimeoutMillis = initialiseTimeoutMillis;
    this.makeMovesDebugTimeoutMillis = makeMovesDebugTimeoutMillis;
    this.initialiseDebugTimeoutMillis = initialiseDebugTimeoutMillis;
    this.foodSpawnProbability = foodSpawnProbability;
    this.battleRadius = battleRadius;
    this.maxFoodSpawnedPerTurn = maxFoodSpawnedPerTurn;
    this.minFoodDistanceFromSpawn = minFoodDistanceFromSpawn;
    this.initialUnitCount = initialUnitCount;
    this.viewDistance = viewDistance;
    this.maximumFoodCount = maximumFoodCount;
    this.debugMode = debugMode;
  }

  public GameConfig withOverrides(GameConfigLayer layer) {
    return new GameConfig(
        layer.getTurnLimit().orElse(getTurnLimit()),
        layer.getMakeMovesTimeoutMillis().orElse(getMakeMovesTimeoutMillis()),
        layer.getInitialiseTimeoutMillis().orElse(getInitialiseTimeoutMillis()),
        layer.getMakeMovesDebugTimeoutMillis().orElse(getMakeMovesDebugTimeoutMillis()),
        layer.getInitialiseDebugTimeoutMillis().orElse(getInitialiseDebugTimeoutMillis()),
        layer.getFoodSpawnProbability().orElse(getFoodSpawnProbability()),
        layer.getBattleRadius().orElse(getBattleRadius()),
        layer.getMaxFoodSpawnedPerTurn().orElse(getMaxFoodSpawnedPerTurn()),
        layer.getMinFoodDistanceFromSpawn().orElse(getMinFoodDistanceFromSpawn()),
        layer.getInitialUnitCount().orElse(getInitialUnitCount()),
        layer.getViewDistance().orElse(getViewDistance()),
        layer.getMaximumFoodCount().orElse(getMaximumFoodCount()),
        false);
  }

  public GameConfig withDebugMode(boolean isDebug) {
    debugMode = isDebug;
    return this;
  }

  public int getTurnLimit() {
    return turnLimit;
  }

  public int getMakeMovesTimeoutMillis() {
    return makeMovesTimeoutMillis;
  }

  public int getInitialiseTimeoutMillis() {
    return initialiseTimeoutMillis;
  }

  public int getMakeMovesDebugTimeoutMillis() {
    return makeMovesDebugTimeoutMillis;
  }

  public int getInitialiseDebugTimeoutMillis() {
    return initialiseDebugTimeoutMillis;
  }

  public double getFoodSpawnProbability() {
    return foodSpawnProbability;
  }

  public int getBattleRadius() {
    return battleRadius;
  }

  public int getMaxFoodSpawnedPerTurn() {
    return maxFoodSpawnedPerTurn;
  }

  public int getMinFoodDistanceFromSpawn() {
    return minFoodDistanceFromSpawn;
  }

  public int getInitialUnitCount() {
    return initialUnitCount;
  }

  public int getViewDistance() {
    return viewDistance;
  }

  public int getMaximumFoodCount() {
    return maximumFoodCount;
  }

  public boolean isDebugMode() {
    return debugMode;
  }
}
