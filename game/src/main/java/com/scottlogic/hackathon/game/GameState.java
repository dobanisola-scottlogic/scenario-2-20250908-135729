package com.scottlogic.hackathon.game;

import java.util.Set;

public interface GameState {
    int getPhase();
    Map getMap();
    Set<Position> getOutOfBoundsPositions();
    Set<Player> getPlayers();
    Set<Player> getRemovedPlayers();
    Set<SpawnPoint> getSpawnPoints();
    Set<SpawnPoint> getRemovedSpawnPoints();
    Set<Collectable> getCollectables();
}
