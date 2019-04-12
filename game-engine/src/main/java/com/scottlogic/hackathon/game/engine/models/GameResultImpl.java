package com.scottlogic.hackathon.game.engine.models;

import com.scottlogic.hackathon.game.*;

import java.util.Collections;
import java.util.List;
import java.util.Set;
import java.util.UUID;

public class GameResultImpl implements GameResult {
    private final UUID id;
    private final List<PhaseResult> phaseResults;
    private final GameGeometry map;
    private final Set<Position> outOfBoundPositions;
    private final CutoffCondition cutoffCondition;

    public GameResultImpl(final List<PhaseResult> phaseResults,
                          final GameGeometry map,
                          final Set<Position> outOfBoundPositions,
                          final CutoffCondition cutoffCondition) {
        this.id = UUID.randomUUID();
        this.phaseResults = phaseResults;
        this.map = map;
        this.outOfBoundPositions = outOfBoundPositions;
        this.cutoffCondition = cutoffCondition;
    }

    @Override
    public UUID getId() {
        return id;
    }

    @Override
    public List<PhaseResult> getPhaseResults() {
        return Collections.unmodifiableList(phaseResults);
    }

    @Override
    public GameGeometry getMap() {
        return map;
    }

    @Override
    public Set<Position> getOutOfBoundPositions() {
        return Collections.unmodifiableSet(outOfBoundPositions);
    }

    @Override
    public CutoffCondition getCutoffCondition() {
        return cutoffCondition;
    }
}
