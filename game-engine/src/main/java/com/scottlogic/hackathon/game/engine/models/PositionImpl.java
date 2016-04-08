package com.scottlogic.hackathon.game.engine.models;

import com.scottlogic.hackathon.game.Position;

public class PositionImpl implements Position {
    private final int x;
    private final int y;

    public PositionImpl(final int x, final int y) {
        if (x < 0) {
            throw new IllegalArgumentException("x must be >= 0");
        }
        if (y < 0) {
            throw new IllegalArgumentException("y must be >= 0");
        }
        this.x = x;
        this.y = y;
    }

    @Override
    public int getX() {
        return x;
    }

    @Override
    public int getY() {
        return y;
    }

    @Override
    public int hashCode() {
        return Integer.hashCode(x) ^ Integer.hashCode(y);
    }

    @Override
    public boolean equals(final Object obj) {
        return obj != null
                && obj instanceof Position
                && x == ((Position) obj).getX()
                && y == ((Position) obj).getY();
    }

    @Override
    public String toString() {
        return String.format("X %s - Y %s", x, y);
    }
}
