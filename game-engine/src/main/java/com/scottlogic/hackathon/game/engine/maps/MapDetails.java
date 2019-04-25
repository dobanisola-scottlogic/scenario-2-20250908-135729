package com.scottlogic.hackathon.game.engine.maps;

import com.scottlogic.hackathon.game.engine.config.GameConfigLayer;

public class MapDetails {
    private final Arena arena;
    private final GameConfigLayer mapSpecificConfig;

    MapDetails(Arena arena, GameConfigLayer mapSpecificConfig) {
        this.arena = arena;
        this.mapSpecificConfig = mapSpecificConfig;
    }

    public Arena getArena() {
        return arena;
    }

    public GameConfigLayer getMapSpecificConfig() {
        return mapSpecificConfig;
    }
}
