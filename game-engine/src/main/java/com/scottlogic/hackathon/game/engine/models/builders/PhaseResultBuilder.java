package com.scottlogic.hackathon.game.engine.models.builders;

import com.scottlogic.hackathon.game.Collectable;
import com.scottlogic.hackathon.game.DisqualifiedBot;
import com.scottlogic.hackathon.game.Player;
import com.scottlogic.hackathon.game.SpawnPoint;
import com.scottlogic.hackathon.game.engine.models.PhaseResultImpl;

import java.util.Set;

public class PhaseResultBuilder {
    private int phase;
    private Set<Player> players;
    private Set<SpawnPoint> spawnPoints;
    private Set<Collectable> collectables;
    private Set<DisqualifiedBot> disqualifiedBots;

    public PhaseResultBuilder setPhase(final int phase) {
        this.phase = phase;
        return this;
    }

    public PhaseResultBuilder setPlayers(final Set<Player> players) {
        this.players = players;
        return this;
    }

    public PhaseResultBuilder setSpawnPoints(final Set<SpawnPoint> spawnPoints) {
        this.spawnPoints = spawnPoints;
        return this;
    }

    public PhaseResultBuilder setCollectables(final Set<Collectable> collectables) {
        this.collectables = collectables;
        return this;
    }

    public PhaseResultBuilder setDisqualifiedBots(final Set<DisqualifiedBot> disqualifiedBots) {
        this.disqualifiedBots = disqualifiedBots;
        return this;
    }

    public PhaseResultImpl createPhaseResult() {
        return new PhaseResultImpl(phase, players, spawnPoints, collectables, disqualifiedBots);
    }
}