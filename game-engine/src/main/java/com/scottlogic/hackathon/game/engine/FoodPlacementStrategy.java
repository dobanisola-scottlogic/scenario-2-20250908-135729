package com.scottlogic.hackathon.game.engine;

import com.scottlogic.hackathon.game.Position;
import com.scottlogic.hackathon.game.engine.maps.Arena;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.Random;
import java.util.Set;
import java.util.function.Predicate;
import java.util.stream.Stream;

/** Picks locations in the given arena where food is allowed to spawn, avoiding specified locations */
class FoodPlacementStrategy {
    private final ArrayList<Position> positions;

    FoodPlacementStrategy(Arena arena) {
        this.positions = new ArrayList<>(arena.getFoodSpawnPositions());
    }

    Stream<Position> getRandomPositions(Predicate<Position> shouldExclude) {
        final Random random = new Random();

        final Set<Position> alreadyEmitted = new HashSet<>();

        return Stream.generate(() -> this.positions.get(random.nextInt(positions.size())))
            .limit(150) // to prevent scenarios where we loop endlessly while looking for a suitable position
            .filter(position -> !shouldExclude.test(position) && !alreadyEmitted.contains(position))
            .peek(alreadyEmitted::add);
    }
}
