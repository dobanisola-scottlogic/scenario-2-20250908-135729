package com.scottlogic.hackathon.game.engine.config;

import java.util.Optional;

import static java.util.Optional.ofNullable;

public class GameConfigLayerBuilder {
  public static GameConfigLayer createEmpty() {
    return new GameConfigLayerBuilder().build();
  }

  private Integer turnLimit;
  private Integer makeMovesTimeoutMillis;
  private Integer initialiseTimeoutMillis;
  private Integer makeMovesDebugTimeoutMillis;
  private Integer initialiseDebugTimeoutMillis;
  private Double foodSpawnProbability;
  private Integer battleRadius;
  private Integer maxFoodSpawnedPerTurn;
  private Integer minFoodDistanceFromSpawn;
  private Integer initialUnitCount;
  private Integer viewDistance;
  private Integer maximumFoodCount;

  public void setTurnLimit(Integer value) {
    turnLimit = value;
  }

  public void setMakeMovesTimeoutMillis(Integer value) {
    makeMovesTimeoutMillis = value;
  }

  public void setInitialiseTimeoutMillis(Integer value) {
    initialiseTimeoutMillis = value;
  }

  public void setMakeMovesTestTimeoutMillis(Integer value) {
    makeMovesDebugTimeoutMillis = value;
  }

  public void setInitialiseTestTimeoutMillis(Integer value) {
    initialiseDebugTimeoutMillis = value;
  }

  public void setFoodSpawnProbability(Double value) {
    foodSpawnProbability = value;
  }

  public void setBattleRadius(Integer value) {
    battleRadius = value;
  }

  public void setMaxFoodSpawnedPerTurn(Integer value) {
    maxFoodSpawnedPerTurn = value;
  }

  public void setMinFoodDistanceFromSpawn(Integer value) {
    minFoodDistanceFromSpawn = value;
  }

  public void setInitialUnitCount(Integer value) {
    initialUnitCount = value;
  }

  public void setViewDistance(Integer value) {
    viewDistance = value;
  }

  public void setMaximumFoodCount(Integer value) {
    maximumFoodCount = value;
  }

  public GameConfigLayer build() {
    return new GameConfigLayerImpl(
        turnLimit,
        makeMovesTimeoutMillis,
        initialiseTimeoutMillis,
        makeMovesDebugTimeoutMillis,
        initialiseDebugTimeoutMillis,
        foodSpawnProbability,
        battleRadius,
        maxFoodSpawnedPerTurn,
        minFoodDistanceFromSpawn,
        initialUnitCount,
        viewDistance,
        maximumFoodCount);
  }

  class GameConfigLayerImpl implements GameConfigLayer {
    private Integer turnLimit;
    private Integer makeMovesTimeoutMillis;
    private Integer initialiseTimeoutMillis;
    private Integer makeMovesDebugTimeoutMillis;
    private Integer initialiseDebugTimeoutMillis;
    private Double foodSpawnProbability;
    private Integer battleRadius;
    private Integer maxFoodSpawnedPerTurn;
    private Integer minFoodDistanceFromSpawn;
    private Integer initialUnitCount;
    private Integer viewDistance;
    private Integer maximumFoodCount;

    GameConfigLayerImpl(
        Integer turnLimit,
        Integer makeMovesTimeoutMillis,
        Integer initialiseTimeoutMillis,
        Integer makeMovesDebugTimeoutMillis,
        Integer initialiseDebugTimeoutMillis,
        Double foodSpawnProbability,
        Integer battleRadius,
        Integer maxFoodSpawnedPerTurn,
        Integer minFoodDistanceFromSpawn,
        Integer spawnPhases,
        Integer viewDistance,
        Integer maximumFoodCount) {

      this.turnLimit = turnLimit;
      this.makeMovesTimeoutMillis = makeMovesTimeoutMillis;
      this.initialiseTimeoutMillis = initialiseTimeoutMillis;
      this.makeMovesDebugTimeoutMillis = makeMovesDebugTimeoutMillis;
      this.initialiseDebugTimeoutMillis = initialiseDebugTimeoutMillis;
      this.foodSpawnProbability = foodSpawnProbability;
      this.battleRadius = battleRadius;
      this.maxFoodSpawnedPerTurn = maxFoodSpawnedPerTurn;
      this.minFoodDistanceFromSpawn = minFoodDistanceFromSpawn;
      this.initialUnitCount = spawnPhases;
      this.viewDistance = viewDistance;
      this.maximumFoodCount = maximumFoodCount;
    }

    @Override
    public Optional<Integer> getTurnLimit() {
      return ofNullable(turnLimit);
    }

    @Override
    public Optional<Integer> getMakeMovesTimeoutMillis() {
      return ofNullable(makeMovesTimeoutMillis);
    }

    @Override
    public Optional<Integer> getInitialiseTimeoutMillis() {
      return ofNullable(initialiseTimeoutMillis);
    }

    @Override
    public Optional<Integer> getMakeMovesDebugTimeoutMillis() {
      return ofNullable(makeMovesDebugTimeoutMillis);
    }

    @Override
    public Optional<Integer> getInitialiseDebugTimeoutMillis() {
      return ofNullable(initialiseDebugTimeoutMillis);
    }

    @Override
    public Optional<Double> getFoodSpawnProbability() {
      return ofNullable(foodSpawnProbability);
    }

    @Override
    public Optional<Integer> getBattleRadius() {
      return ofNullable(battleRadius);
    }

    @Override
    public Optional<Integer> getMaxFoodSpawnedPerTurn() {
      return ofNullable(maxFoodSpawnedPerTurn);
    }

    @Override
    public Optional<Integer> getMinFoodDistanceFromSpawn() {
      return ofNullable(minFoodDistanceFromSpawn);
    }

    @Override
    public Optional<Integer> getInitialUnitCount() {
      return ofNullable(initialUnitCount);
    }

    @Override
    public Optional<Integer> getViewDistance() {
      return ofNullable(viewDistance);
    }

    @Override
    public Optional<Integer> getMaximumFoodCount() {
      return ofNullable(maximumFoodCount);
    }
  }
}
