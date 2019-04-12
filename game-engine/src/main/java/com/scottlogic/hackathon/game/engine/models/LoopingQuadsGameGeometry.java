package com.scottlogic.hackathon.game.engine.models;

import com.scottlogic.hackathon.game.Direction;
import com.scottlogic.hackathon.game.GameGeometry;
import com.scottlogic.hackathon.game.Position;

public class LoopingQuadsGameGeometry implements GameGeometry {
    private final int width;
    private final int height;

    public LoopingQuadsGameGeometry(final int width, final int height) {
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

        return getPosition(x, y);
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
    public Position getPosition(int x, int y) {
        return new Position(
            Math.floorMod(x, getWidth()),
            Math.floorMod(y, getHeight()));
    }
}
