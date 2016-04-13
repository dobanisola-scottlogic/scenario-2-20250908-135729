package com.scottlogic.hackathon.game.engine.models;

import com.scottlogic.hackathon.game.*;

public class PhaseResultImpl implements PhaseResult {
    private final int phase;
    private final TrackedSet<Player> players;
    private final TrackedSet<SpawnPoint> spawnPoints;
    private final TrackedSet<Collectable> collectables;
    private final TrackedSet<DisqualifiedBot> disqualifiedBots;

    public PhaseResultImpl(final int phase,
                           final TrackedSet<Player> players,
                           final TrackedSet<SpawnPoint> spawnPoints,
                           final TrackedSet<Collectable> collectables,
                           final TrackedSet<DisqualifiedBot> disqualifiedBots) {
        this.phase = phase;
        this.players = players;
        this.spawnPoints = spawnPoints;
        this.collectables = collectables;
        this.disqualifiedBots = disqualifiedBots;
    }

    @Override
    public int getPhase() {
        return phase;
    }

    @Override
    public TrackedSet<Player> getPlayers() {
        return players;
    }

    @Override
    public TrackedSet<SpawnPoint> getSpawnPoints() {
        return spawnPoints;
    }

    @Override
    public TrackedSet<Collectable> getCollectables() {
        return collectables;
    }

    @Override
    public TrackedSet<DisqualifiedBot> getDisqualifiedBots() {
        return disqualifiedBots;
    }

    public String toString() {
        return String.format("Phase %s - Players %s - Spawn Points %s - Collectables %s - Disqualified Bots %s",
                phase,
                players.size(),
                spawnPoints.size(),
                collectables.size(),
                disqualifiedBots.size());
    }
}
