package com.scottlogic.hackathon.game.engine.models;

import com.scottlogic.hackathon.game.Direction;
import com.scottlogic.hackathon.game.Map;
import com.scottlogic.hackathon.game.Position;

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

    @Override
    public Position getRelativePosition(Position from, Direction direction, int distance) {
        int x = from.getX();
        int y = from.getY();

        if(direction.isEastward()) {
            x += distance;
        } else if(direction.isWestward()) {
            x -= distance;
        }

        if(direction.isNorthward()) {
            y -= distance;
        } else if(direction.isSouthward()) {
            y += distance;
        }

        return createPosition(x, y);
    }

    @Override
    public int xDistance(Position a, Position b) {
        return directedDistance(a.getX(), b.getX(), getWidth());
    }

    @Override
    public int yDistance(Position a, Position b) {
        return directedDistance(a.getY(), b.getY(), getHeight());
    }


    private int directedDistance(int a, int b, int extent) {
        int d = Math.abs(b - a);
        return d > extent/2 ? extent-d : d;
    }

    @Override
    public Position createPosition(int x, int y) {
        return new Position(mod(x, getWidth()), mod(y, getHeight()));
    }

    private int mod(int val, int mod) {
        val %= mod;
        if(val < 0) {
            val += mod;
        }
        return val;
    }
}
