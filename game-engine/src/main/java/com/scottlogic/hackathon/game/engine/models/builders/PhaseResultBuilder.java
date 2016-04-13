package com.scottlogic.hackathon.game.engine.models.builders;

import com.scottlogic.hackathon.game.*;
import com.scottlogic.hackathon.game.engine.models.PhaseResultImpl;

public class PhaseResultBuilder {
    private int phase;
    private TrackedSet<Player> players;
    private TrackedSet<SpawnPoint> spawnPoints;
    private TrackedSet<Collectable> collectables;
    private TrackedSet<DisqualifiedBot> disqualifiedBots;

    public PhaseResultBuilder setPhase(final int phase) {
        this.phase = phase;
        return this;
    }

    public PhaseResultBuilder setPlayers(final TrackedSet<Player> players) {
        this.players = players;
        return this;
    }

    public PhaseResultBuilder setSpawnPoints(final TrackedSet<SpawnPoint> spawnPoints) {
        this.spawnPoints = spawnPoints;
        return this;
    }

    public PhaseResultBuilder setCollectables(final TrackedSet<Collectable> collectables) {
        this.collectables = collectables;
        return this;
    }


    public PhaseResultBuilder setDisqualifiedBots(final TrackedSet<DisqualifiedBot> disqualifiedBots) {
        this.disqualifiedBots = disqualifiedBots;
        return this;
    }

    public PhaseResultImpl createPhaseResult() {
        return new PhaseResultImpl(phase, players, spawnPoints, collectables,  disqualifiedBots);
    }
}