package com.scottlogic.hackathon.game.engine.config;

import java.util.Optional;

public interface GameConfigLayer {
  Optional<Integer> getTurnLimit();

  Optional<Integer> getMakeMovesTimeoutMillis();

  Optional<Integer> getInitialiseTimeoutMillis();

  Optional<Integer> getMakeMovesDebugTimeoutMillis();

  Optional<Integer> getInitialiseDebugTimeoutMillis();

  Optional<Double> getFoodSpawnProbability();

  Optional<Integer> getBattleRadius();

  Optional<Integer> getMaxFoodSpawnedPerTurn();

  Optional<Integer> getMinFoodDistanceFromSpawn();

  Optional<Integer> getInitialUnitCount();

  Optional<Integer> getViewDistance();

  Optional<Integer> getMaximumFoodCount();
}
