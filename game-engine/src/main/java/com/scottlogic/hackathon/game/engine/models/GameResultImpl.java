package com.scottlogic.hackathon.game.engine.models;

import com.scottlogic.hackathon.game.CutoffCondition;
import com.scottlogic.hackathon.game.GameResult;
import com.scottlogic.hackathon.game.Map;
import com.scottlogic.hackathon.game.PhaseResult;
import com.scottlogic.hackathon.game.Position;

import java.util.Collections;
import java.util.List;
import java.util.Set;

public class GameResultImpl implements GameResult {
    private final List<PhaseResult> phaseResults;
    private final Map map;
    private final Set<Position> outOfBoundPositions;
    private final CutoffCondition cutoffCondition;

    public GameResultImpl(final List<PhaseResult> phaseResults, final Map map, final Set<Position> outOfBoundPositions,
                          final CutoffCondition cutoffCondition) {
        this.phaseResults = phaseResults;
        this.map = map;
        this.outOfBoundPositions = outOfBoundPositions;
        this.cutoffCondition = cutoffCondition;
    }

    @Override
    public List<PhaseResult> getPhaseResults() {
        return Collections.unmodifiableList(phaseResults);
    }

    @Override
    public Map getMap() {
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
