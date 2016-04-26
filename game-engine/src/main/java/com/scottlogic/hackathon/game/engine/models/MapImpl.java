package com.scottlogic.hackathon.game.engine.models;

import com.scottlogic.hackathon.game.Map;

public class MapImpl implements Map {
    private final int width;
    private final int height;

    public MapImpl(final int width, final int height) {
        this.width = width;
        this.height = height;
    }

    @Override
    public int getWidth() {
        return width;
    }

    @Override
    public int getHeight() {
        return height;
    }
}
