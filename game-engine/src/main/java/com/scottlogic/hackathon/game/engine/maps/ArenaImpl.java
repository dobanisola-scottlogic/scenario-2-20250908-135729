package com.scottlogic.hackathon.game.engine.maps;

import com.scottlogic.hackathon.game.Position;
import com.scottlogic.hackathon.game.engine.models.GameMapImpl;

import java.util.Collections;
import java.util.Set;
import java.util.function.Function;
import java.util.stream.IntStream;
import java.util.stream.Stream;

class ArenaImpl extends GameMapImpl implements Arena {
    private final String name;
    private final Set<Position> outOfBoundsPositions;
    private final Set<Position> spawnPointPositions;

    ArenaImpl(
            final String name,
            final int width,
            final int height,
            final Set<Position> outOfBoundsPositions,
            final Set<Position> spawnPointPositions)
            throws IllegalArgumentException {

        super(width, height);
        this.name = name;
        this.outOfBoundsPositions = outOfBoundsPositions;
        this.spawnPointPositions = spawnPointPositions;

        if (outOfBoundsPositions.stream().anyMatch((outOfBoundsPosition) -> !this.contains(outOfBoundsPosition))) {
            throw new IllegalArgumentException("all out of bounds positions must be inside the map");
        }

        if (spawnPointPositions.stream().anyMatch((spawnPointPosition) -> !this.contains(spawnPointPosition))) {
            throw new IllegalArgumentException("all spawn point positions must be inside the map");
        }

        if (spawnPointPositions.size() == 0) {
            throw new IllegalArgumentException("must have some spawn points");
        }
    }

    public String toString() {
        return String.format("With %s - Height %s - Spawn Point Positions %s - Out Of Bounds Positions %s",
                getWidth(),
                getHeight(),
                spawnPointPositions.size(),
                outOfBoundsPositions.size());
    }

    @Override
    public String getName() {
        return name;
    }

    @Override
    public Set<Position> getOutOfBoundsPositions() {
        return Collections.unmodifiableSet(outOfBoundsPositions);
    }

    @Override
    public Set<Position> getSpawnPointPositions() {
        return Collections.unmodifiableSet(spawnPointPositions);
    }

    @Override
    public boolean contains(final Position position) {
        return position.getX() >= 0
                && position.getX() < getWidth()
                && position.getY() >= 0
                && position.getY() < getHeight();
    }

    @Override
    public Stream<Position> getSurroundingPositions(final Position position, final int distance) {
        return IntStream.rangeClosed(position.getX()-distance, position.getX()+distance)
                .mapToObj(x -> IntStream.rangeClosed(position.getY()-distance, position.getY()+distance)
                        .mapToObj(y -> createPosition(x, y)))
                .flatMap(Function.identity());
    }
}
