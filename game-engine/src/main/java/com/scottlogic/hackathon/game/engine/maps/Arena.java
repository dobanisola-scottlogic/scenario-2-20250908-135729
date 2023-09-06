package com.scottlogic.hackathon.game.engine.maps;

import java.util.Collections;
import java.util.Set;

import com.scottlogic.hackathon.game.GameGeometry;
import com.scottlogic.hackathon.game.Position;
import com.scottlogic.hackathon.game.engine.config.GameConfigLayer;

/**
 * A definition of an area in which battles could be held, and any map-specific config that applies.
 * Faithfully represents the contents of a map file without any
 */
public class Arena {
  private final String name;

  private final GameGeometry geometry;

  private final Set<Position> outOfBoundsPositions;
  private final Set<Position> spawnPointPositions;
  private final Set<Position> foodSpawnPositions;

  private final GameConfigLayer mapSpecificConfig;

  /** copy (with changes) constructor */
  private Arena(Arena other, Set<Position> foodSpawnPositions) {
    this(
        other.name,
        other.geometry,
        other.outOfBoundsPositions,
        other.spawnPointPositions,
        foodSpawnPositions,
        other.mapSpecificConfig);
  }

  Arena(
      final String name,
      final GameGeometry geometry,
      final Set<Position> outOfBoundsPositions,
      final Set<Position> spawnPointPositions,
      final Set<Position> foodSpawnPositions,
      final GameConfigLayer mapSpecificConfig)
      throws IllegalArgumentException {

    this.name = name;
    this.geometry = geometry;
    this.outOfBoundsPositions = Collections.unmodifiableSet(outOfBoundsPositions);
    this.spawnPointPositions = Collections.unmodifiableSet(spawnPointPositions);
    this.foodSpawnPositions = Collections.unmodifiableSet(foodSpawnPositions);
    this.mapSpecificConfig = mapSpecificConfig;

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

  public GameGeometry getGeometry() {
    return geometry;
  }

  public GameConfigLayer getMapSpecificConfig() {
    return mapSpecificConfig;
  }

  public String toString() {
    return String.format(
        "With %s - Height %s - Spawn Point Positions %s - Out Of Bounds Positions %s",
        geometry.getWidth(),
        geometry.getHeight(),
        spawnPointPositions.size(),
        outOfBoundsPositions.size());
  }

  public String getName() {
    return name;
  }

  public Set<Position> getOutOfBoundsPositions() {
    return outOfBoundsPositions;
  }

  public Set<Position> getSpawnPointPositions() {
    return spawnPointPositions;
  }

  public Set<Position> getFoodSpawnPositions() {
    return foodSpawnPositions;
  }

  public Arena withFoodSpawnPositions(Set<Position> positions) {
    return new Arena(this, positions);
  }

  private boolean isOutsideArena(final Position position) {
    return position.getX() < 0
        || position.getX() >= geometry.getWidth()
        || position.getY() < 0
        || position.getY() >= geometry.getHeight();
  }
}
