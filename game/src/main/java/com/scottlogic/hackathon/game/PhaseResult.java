package com.scottlogic.hackathon.game;

import java.util.Set;

public interface PhaseResult {
    int getPhase();
    Set<Player> getPlayers();
    Set<SpawnPoint> getSpawnPoints();
    Set<Collectable> getCollectables();
    Set<DisqualifiedBot> getDisqualifiedBots();
}
