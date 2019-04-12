package com.scottlogic.hackathon.game.engine.config;

public class GameConfig {
    public static GameConfig defaults = new GameConfig(
        512,
        500,
        2000,
        0.8,
        2,
        4,
        8,
        8,
        6,
        999999999);

    private int turnLimit;
    private int makeMovesTimeoutMillis;
    private int initialiseTimeoutMillis;
    private double foodSpawnProbability;
    private int battleRadius;
    private int maxFoodSpawnedPerTurn;
    private int minFoodDistanceFromSpawn;
    private int initialUnitCount;
    private int viewDistance;
    private int maximumFoodCount;

    private GameConfig(
        int turnLimit,
        int makeMovesTimeoutMillis,
        int initialiseTimeoutMillis,
        double foodSpawnProbability,
        int battleRadius,
        int maxFoodSpawnedPerTurn,
        int minFoodDistanceFromSpawn,
        int initialUnitCount,
        int viewDistance,
        int maximumFoodCount) {

        this.turnLimit = turnLimit;
        this.makeMovesTimeoutMillis = makeMovesTimeoutMillis;
        this.initialiseTimeoutMillis = initialiseTimeoutMillis;
        this.foodSpawnProbability = foodSpawnProbability;
        this.battleRadius = battleRadius;
        this.maxFoodSpawnedPerTurn = maxFoodSpawnedPerTurn;
        this.minFoodDistanceFromSpawn = minFoodDistanceFromSpawn;
        this.initialUnitCount = initialUnitCount;
        this.viewDistance = viewDistance;
        this.maximumFoodCount = maximumFoodCount;
    }

    public GameConfig withOverrides(GameConfigLayer layer) {
        return new GameConfig(
            layer.getTurnLimit().orElse(getTurnLimit()),
            layer.getMakeMovesTimeoutMillis().orElse(getMakeMovesTimeoutMillis()),
            layer.getInitialiseTimeoutMillis().orElse(getInitialiseTimeoutMillis()),
            layer.getFoodSpawnProbability().orElse(getFoodSpawnProbability()),
            layer.getBattleRadius().orElse(getBattleRadius()),
            layer.getMaxFoodSpawnedPerTurn().orElse(getMaxFoodSpawnedPerTurn()),
            layer.getMinFoodDistanceFromSpawn().orElse(getMinFoodDistanceFromSpawn()),
            layer.getInitialUnitCount().orElse(getInitialUnitCount()),
            layer.getViewDistance().orElse(getViewDistance()),
            layer.getMaximumFoodCount().orElse(getMaximumFoodCount()));
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
}
