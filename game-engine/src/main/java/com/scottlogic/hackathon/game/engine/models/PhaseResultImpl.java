package com.scottlogic.hackathon.game.engine.models;

import com.scottlogic.hackathon.game.*;

import java.util.Collections;
import java.util.Set;

public class PhaseResultImpl implements PhaseResult {
    private final int phase;
    private final Set<Player> players;
    private final Set<SpawnPoint> spawnPoints;
    private final Set<Collectable> collectables;
    private final Set<DisqualifiedBot> disqualifiedBots;

    public PhaseResultImpl(final int phase,
                           final Set<Player> players,
                           final Set<SpawnPoint> spawnPoints,
                           final Set<Collectable> collectables,
                           final Set<DisqualifiedBot> disqualifiedBots) {
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
    public Set<Player> getPlayers() {
        return Collections.unmodifiableSet(players);
    }

    @Override
    public Set<SpawnPoint> getSpawnPoints() {
        return Collections.unmodifiableSet(spawnPoints);
    }

    @Override
    public Set<Collectable> getCollectables() {
        return Collections.unmodifiableSet(collectables);
    }

    @Override
    public Set<DisqualifiedBot> getDisqualifiedBots() {
        return Collections.unmodifiableSet(disqualifiedBots);
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
