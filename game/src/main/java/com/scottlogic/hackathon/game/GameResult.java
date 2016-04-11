package com.scottlogic.hackathon.game;

import java.util.List;
import java.util.Set;

public interface GameResult {
    List<PhaseResult> getPhaseResults();
    Map getMap();
    Set<Position> getOutOfBoundPositions();
    CutoffCondition getCutoffCondition();
}
