package com.scottlogic.hackathon.game.engine.maps;

public class LoadableMap {
    private int width;
    private int height;
    private Double perTurnFoodSpawnProbability;
    private Integer maximumFoodCount;
    private int[] data;
    private Integer maximumTurnCount;
    private Integer initialUnitSpawnCount;
    private Integer battleRadius;
    private Integer viewDistance;

    public LoadableMap() {

    }

    public int getWidth() {
        return width;
    }

    public int getHeight() {
        return height;
    }

    public int[] getData() {
        return data;
    }

    public Double getPerTurnFoodSpawnProbability() {
        return perTurnFoodSpawnProbability;
    }

    public Integer getMaximumFoodCount() {
        return maximumFoodCount;
    }

    public Integer getMaximumTurnCount() {
        return maximumTurnCount;
    }

    public Integer getInitialUnitSpawnCount() {
        return initialUnitSpawnCount;
    }

    public Integer getBattleRadius() {
        return battleRadius;
    }

    public Integer getViewDistance() {
        return viewDistance;
    }
}
