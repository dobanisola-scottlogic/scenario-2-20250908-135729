package com.scottlogic.hackathon.game;

import java.util.List;
import java.util.Set;
import java.util.UUID;

public interface GameResult {
    UUID getId();
    List<PhaseResult> getPhaseResults();
    GameMap getMap();
    Set<Position> getOutOfBoundPositions();
    CutoffCondition getCutoffCondition();
}
