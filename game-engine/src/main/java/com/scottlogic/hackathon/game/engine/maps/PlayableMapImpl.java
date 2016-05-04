package com.scottlogic.hackathon.game.engine.maps;

import com.scottlogic.hackathon.game.Direction;
import com.scottlogic.hackathon.game.Position;

import java.util.Arrays;
import java.util.Collections;
import java.util.Set;
import java.util.stream.IntStream;
import java.util.stream.Stream;

class PlayableMapImpl implements PlayableMap {
    private final String name;
    private final int width;
    private final int height;
    private final Set<Position> outOfBoundsPositions;
    private final Set<Position> spawnPointPositions;

    public PlayableMapImpl(
            final String name,
            final int width,
            final int height,
            final Set<Position> outOfBoundsPositions,
            final Set<Position> spawnPointPositions) throws Exception {
        this.name = name;
        this.width = width;
        this.height = height;
        this.outOfBoundsPositions = outOfBoundsPositions;
        this.spawnPointPositions = spawnPointPositions;
        this.validate();
    }

    public void validate() throws Exception {
        if (outOfBoundsPositions.stream().anyMatch((outOfBoundsPosition) -> !this.contains(outOfBoundsPosition))) {
            throw new Exception("all out of bounds positions must be inside the map");
        }

        if (spawnPointPositions.stream().anyMatch((spawnPointPosition) -> !this.contains(spawnPointPosition))) {
            throw new Exception("all spawn point positions must be inside the map");
        }

        if (spawnPointPositions.size() == 0) {
            throw new Exception("must have some spawn points");
        }
    }

    public String toString() {
        return String.format("With %s - Height %s - Spawn Point Positions %s - Out Of Bounds Positions %s",
                width,
                height,
                spawnPointPositions.size(),
                outOfBoundsPositions.size());
    }

    @Override
    public String getName() {
        return name;
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
                && position.getX() < width
                && position.getY() >= 0
                && position.getY() < height;
    }

    @Override
    public Position calculatePosition(final Position position, final Direction direction) {
        return calculatePosition(position, direction, 1);
    }

    @Override
    public Position calculatePosition(final Position position, final Direction direction, final int distance) {
        if (distance <= 0) {
            throw new IllegalArgumentException("distance must be greater than 0");
        }
        int x = position.getX();
        int y = position.getY();

        if (direction == Direction.NORTHWEST || direction == Direction.WEST || direction == Direction.SOUTHWEST) {
            x = (x - distance) % width;
            if (x < 0) {
                x = width + x;
            }
        } else if (direction == Direction.NORTHEAST || direction == Direction.EAST || direction == Direction.SOUTHEAST) {
            x = (x + distance) % width;
        }

        if (direction == Direction.NORTHEAST || direction == Direction.NORTH || direction == Direction.NORTHWEST) {
            y = (y - distance) % height;
            if (y < 0) {
                y = height + y;
            }
        } else if (direction == Direction.SOUTHEAST || direction == Direction.SOUTH || direction == Direction.SOUTHWEST) {
            y = (y + distance) % height;
        }

        return new Position(x, y);
    }

    @Override
    public Stream<Position> getSurroundingPositions(final Position position, final int distance, final boolean includeOrigin) {
        final IntStream distanceStream = IntStream.rangeClosed(1, distance);
        Stream<Position> positions = Arrays.stream(Direction.values())
                .flatMap(direction -> IntStream.rangeClosed(1, distance)
                        .mapToObj(currentDistance -> calculatePosition(position, direction, currentDistance)));

        if (includeOrigin) {
            positions = Stream.concat(Stream.of(position), positions);
        }

        return positions;
    }

    @Override
    public int distanceBetween(final Position position1, final Position position2) {
        final int x1 = position1.getX();
        final int x2 = position2.getX();
        final int y1 = position1.getY();
        final int y2 = position2.getY();

        final int deltaX = Math.min(Math.abs(x1 - x2), getWidth() - Math.abs(x1 - x2));
        final int deltaY = Math.min(Math.abs(y1 - y2), getHeight() - Math.abs(y1 - y2));

        return (int) Math.sqrt((deltaX * deltaX) + (deltaY * deltaY));
    }


}
