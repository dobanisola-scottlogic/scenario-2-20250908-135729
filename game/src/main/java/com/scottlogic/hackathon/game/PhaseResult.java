package com.scottlogic.hackathon.game;

public interface PhaseResult {
    int getPhase();
    TrackedSet<Player> getPlayers();
    TrackedSet<SpawnPoint> getSpawnPoints();
    TrackedSet<Collectable> getCollectables();
    TrackedSet<DisqualifiedBot> getDisqualifiedBots();
}
