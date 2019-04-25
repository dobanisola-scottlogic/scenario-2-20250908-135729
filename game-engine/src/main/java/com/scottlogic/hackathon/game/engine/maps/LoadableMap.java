package com.scottlogic.hackathon.game.engine.maps;

import java.util.Optional;

class LoadableMap {
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

    Optional<Double> getPerTurnFoodSpawnProbability() {
        return Optional.ofNullable(perTurnFoodSpawnProbability);
    }

    Optional<Integer> getMaximumFoodCount() {
        return Optional.ofNullable(maximumFoodCount);
    }

    Optional<Integer> getMaximumTurnCount() {
        return Optional.ofNullable(maximumTurnCount);
    }

    Optional<Integer> getInitialUnitSpawnCount() {
        return Optional.ofNullable(initialUnitSpawnCount);
    }

    Optional<Integer> getBattleRadius() {
        return Optional.ofNullable(battleRadius);
    }

    Optional<Integer> getViewDistance() {
        return Optional.ofNullable(viewDistance);
    }
}
