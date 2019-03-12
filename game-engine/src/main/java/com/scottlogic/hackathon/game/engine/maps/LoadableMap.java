package com.scottlogic.hackathon.game.engine.maps;

public class LoadableMap {
    private int width;
    private int height;
    private Double perTurnFoodSpawnProbability;
    private int[] data;

    public LoadableMap() {

    }

    public int getWidth() {
        return width;
    }

    public int getHeight() {
        return height;
    }

    public Double getPerTurnFoodSpawnProbability() {
        return perTurnFoodSpawnProbability;
    }

    public int[] getData() {
        return data;
    }
}
