package com.scottlogic.hackathon.game.engine.models;

import com.scottlogic.hackathon.game.*;

import java.util.Collections;
import java.util.Set;

public class GameStateImpl implements GameState {
    private final int phase;
    private final Map map;
    private final Set<Position> outOfBoundsPositions;
    private final Set<Player> players;
    private final Set<Player> removedPlayers;
    private final Set<SpawnPoint> spawnPoints;
    private final Set<SpawnPoint> removedSpawnPoints;
    private final Set<Collectable> collectables;

    public GameStateImpl(final int phase,
                         final Map map,
                         final Set<Position> outOfBoundsPositions,
                         final Set<Player> players,
                         final Set<Player> removedPlayers,
                         final Set<SpawnPoint> spawnPoints,
                         final Set<SpawnPoint> removedSpawnPoints,
                         final Set<Collectable> collectables) {
        this.phase = phase;
        this.map = map;
        this.outOfBoundsPositions = outOfBoundsPositions;
        this.players = players;
        this.removedPlayers = removedPlayers;
        this.spawnPoints = spawnPoints;
        this.removedSpawnPoints = removedSpawnPoints;
        this.collectables = collectables;
    }

    @Override
    public int getPhase() {
        return phase;
    }

    @Override
    public Map getMap() {
        return map;
    }

    @Override
    public Set<Player> getPlayers() {
        return Collections.unmodifiableSet(players);
    }

    @Override
    public Set<Player> getRemovedPlayers() {
        return Collections.unmodifiableSet(removedPlayers);
    }

    @Override
    public Set<SpawnPoint> getSpawnPoints() {
        return Collections.unmodifiableSet(spawnPoints);
    }

    @Override
    public Set<SpawnPoint> getRemovedSpawnPoints() {
        return Collections.unmodifiableSet(removedSpawnPoints);
    }

    @Override
    public Set<Collectable> getCollectables() {
        return Collections.unmodifiableSet(collectables);
    }

    @Override
    public Set<Position> getOutOfBoundsPositions() {
        return Collections.unmodifiableSet(outOfBoundsPositions);
    }
}
