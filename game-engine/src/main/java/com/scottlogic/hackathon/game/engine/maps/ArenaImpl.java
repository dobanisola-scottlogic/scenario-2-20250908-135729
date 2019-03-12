package com.scottlogic.hackathon.game.engine.maps;

import com.scottlogic.hackathon.game.Position;
import com.scottlogic.hackathon.game.engine.models.GameMapImpl;

import java.util.Collections;
import java.util.Optional;
import java.util.Set;
import java.util.function.Function;
import java.util.stream.IntStream;
import java.util.stream.Stream;

class ArenaImpl extends GameMapImpl implements Arena {
    private final String name;
    private final Set<Position> outOfBoundsPositions;
    private final Set<Position> spawnPointPositions;
    private final Double perTurnFoodSpawnProbability;
    private final Integer maximumFoodCount;
    private final Integer maximumTurnCount;
    private final Integer initialUnitSpawnCount;
    private final Integer battleRadius;

    public ArenaImpl(
            final String name,
            final int width,
            final int height,
            final Set<Position> outOfBoundsPositions,
            final Set<Position> spawnPointPositions,
            final Double perTurnFoodSpawnProbability,
            final Integer maximumFoodCount,
            final Integer maximumTurnCount,
            final Integer initialUnitSpawnCount,
            final Integer battleRadius)
            throws Exception {

        super(width, height);
        this.name = name;
        this.outOfBoundsPositions = outOfBoundsPositions;
        this.spawnPointPositions = spawnPointPositions;
        this.perTurnFoodSpawnProbability = perTurnFoodSpawnProbability;
        this.maximumFoodCount = maximumFoodCount;
        this.maximumTurnCount = maximumTurnCount;
        this.initialUnitSpawnCount = initialUnitSpawnCount;
        this.battleRadius = battleRadius;
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

        if (perTurnFoodSpawnProbability != null && (perTurnFoodSpawnProbability < 0 || perTurnFoodSpawnProbability > 1)) {
            throw new Exception("perTurnFoodSpawnProbability must be >=0 and <=1");
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

    public Optional<Double> getPerTurnFoodSpawnProbability() {
        return perTurnFoodSpawnProbability == null ? Optional.empty() : Optional.of(perTurnFoodSpawnProbability);
    }

    @Override
    public Optional<Integer> getMaximumFoodCount() {
        return maximumFoodCount == null ? Optional.empty() : Optional.of(maximumFoodCount);
    }

    @Override
    public Optional<Integer> getMaximumTurnCount() {
        return maximumTurnCount == null ? Optional.empty() : Optional.of(maximumTurnCount);
    }

    @Override
    public Optional<Integer> getBattleRadius() {
        return battleRadius == null ? Optional.empty() : Optional.of(battleRadius);
    }

    @Override
    public Optional<Integer> getInitialUnitSpawnCount() {
        return initialUnitSpawnCount == null ? Optional.empty() : Optional.of(initialUnitSpawnCount);
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
