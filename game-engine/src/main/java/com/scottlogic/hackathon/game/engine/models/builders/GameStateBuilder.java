package com.scottlogic.hackathon.game.engine.models.builders;

import java.util.Set;

import com.scottlogic.hackathon.game.*;

public class GameStateBuilder {
  private int phase;
  private GameGeometry map;
  private Set<Position> outOfBoundsPositions;
  private Set<Player> players;
  private Set<Player> removedPlayers;
  private Set<SpawnPoint> spawnPoints;
  private Set<SpawnPoint> removedSpawnPoints;
  private Set<Collectable> collectables;

  public GameStateBuilder setPhase(final int phase) {
    this.phase = phase;
    return this;
  }

  public GameStateBuilder setMap(final GameGeometry map) {
    this.map = map;
    return this;
  }

  public GameStateBuilder setOutOfBoundsPositions(final Set<Position> outOfBoundsPositions) {
    this.outOfBoundsPositions = outOfBoundsPositions;
    return this;
  }

  public GameStateBuilder setPlayers(final Set<Player> players) {
    this.players = players;
    return this;
  }

  public GameStateBuilder setRemovedPlayers(final Set<Player> removedPlayers) {
    this.removedPlayers = removedPlayers;
    return this;
  }

  public GameStateBuilder setSpawnPoints(final Set<SpawnPoint> spawnPoints) {
    this.spawnPoints = spawnPoints;
    return this;
  }

  public GameStateBuilder setRemovedSpawnPoints(final Set<SpawnPoint> removedSpawnPoints) {
    this.removedSpawnPoints = removedSpawnPoints;
    return this;
  }

  public GameStateBuilder setCollectables(final Set<Collectable> collectables) {
    this.collectables = collectables;
    return this;
  }

  public GameState createGameState() {
    return new GameState(
        phase,
        map,
        outOfBoundsPositions,
        players,
        removedPlayers,
        spawnPoints,
        removedSpawnPoints,
        collectables);
  }
}
