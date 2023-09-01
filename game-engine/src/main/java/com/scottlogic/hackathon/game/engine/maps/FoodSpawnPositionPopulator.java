package com.scottlogic.hackathon.game.engine.maps;

import java.util.stream.Collectors;

import com.scottlogic.hackathon.game.engine.config.GameConfig;

/**
 * Given an arena, checks whether it has food spawn positions; if not, fills in everything that's
 * not a wall.
 */
public class FoodSpawnPositionPopulator {
  public Arena populateFoodSpawnPositions(final Arena arena, final GameConfig gameConfig) {

    if (arena.getFoodSpawnPositions().size() > 0) return arena;

    return arena.withFoodSpawnPositions(
        arena
            .getGeometry()
            .getAllPositions()
            .filter(
                possibleFoodSpawnPoint ->
                    !arena.getOutOfBoundsPositions().contains(possibleFoodSpawnPoint))
            .collect(Collectors.toSet()));
  }
}
