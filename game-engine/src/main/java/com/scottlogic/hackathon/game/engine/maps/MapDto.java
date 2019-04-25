package com.scottlogic.hackathon.game.engine.maps;

import java.util.Optional;

class MapDto {
    public int width;
    public int height;
    public int[] data;
    public String[] map;

    public Double perTurnFoodSpawnProbability;
    public Integer maximumFoodCount;
    public Integer maximumTurnCount;
    public Integer initialUnitSpawnCount;
    public Integer battleRadius;
    public Integer viewDistance;
}
