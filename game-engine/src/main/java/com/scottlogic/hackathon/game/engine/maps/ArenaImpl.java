package com.scottlogic.hackathon.game.engine.maps;

import com.scottlogic.hackathon.game.GameGeometry;
import com.scottlogic.hackathon.game.Position;
import com.scottlogic.hackathon.game.engine.models.LoopingQuadsGameGeometry;

import java.util.Collections;
import java.util.Set;

class ArenaImpl implements Arena {
    private final String name;
    private final GameGeometry gameGeometry;
    private final Set<Position> outOfBoundsPositions;
    private final Set<Position> spawnPointPositions;

    ArenaImpl(
            final String name,
            final int width,
            final int height,
            final Set<Position> outOfBoundsPositions,
            final Set<Position> spawnPointPositions)
            throws IllegalArgumentException {

        this.name = name;
        this.gameGeometry = new LoopingQuadsGameGeometry(width, height);
        this.outOfBoundsPositions = outOfBoundsPositions;
        this.spawnPointPositions = spawnPointPositions;

        if (outOfBoundsPositions.stream().anyMatch(this::isOutsideArena)) {
            throw new IllegalArgumentException("all out of bounds positions must be inside the map");
        }

        if (spawnPointPositions.stream().anyMatch(this::isOutsideArena)) {
            throw new IllegalArgumentException("all spawn point positions must be inside the map");
        }

        if (spawnPointPositions.size() == 0) {
            throw new IllegalArgumentException("must have some spawn points");
        }
    }

    public String toString() {
        return String.format("With %s - Height %s - Spawn Point Positions %s - Out Of Bounds Positions %s",
                gameGeometry.getWidth(),
                gameGeometry.getHeight(),
                spawnPointPositions.size(),
                outOfBoundsPositions.size());
    }

    @Override
    public String getName() {
        return name;
    }

    @Override
    public GameGeometry getGeometry() {
        return null;
    }

    @Override
    public Set<Position> getOutOfBoundsPositions() {
        return Collections.unmodifiableSet(outOfBoundsPositions);
    }

    @Override
    public Set<Position> getSpawnPointPositions() {
        return Collections.unmodifiableSet(spawnPointPositions);
    }

    private boolean isOutsideArena(final Position position) {
        return position.getX() >= 0
            && position.getX() < gameGeometry.getWidth()
            && position.getY() >= 0
            && position.getY() < gameGeometry.getHeight();
    }
}
