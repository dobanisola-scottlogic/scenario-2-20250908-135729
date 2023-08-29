package com.scottlogic.hackathon.game.engine.models;

import java.util.Collections;
import java.util.List;
import java.util.Set;
import java.util.UUID;
import javax.persistence.Column;
import lombok.Getter;

import com.scottlogic.hackathon.game.*;

public class GameResultImpl implements GameResult {
  @Getter
  @Column(columnDefinition = "uuid")
  private final UUID id;

  private final List<PhaseResult> phaseResults;
  @Getter private final GameGeometry map;
  private final Set<Position> outOfBoundPositions;
  @Getter private final CutoffCondition cutoffCondition;

  public GameResultImpl(
      final List<PhaseResult> phaseResults,
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
  public List<PhaseResult> getPhaseResults() {
    return Collections.unmodifiableList(phaseResults);
  }

  @Override
  public Set<Position> getOutOfBoundPositions() {
    return Collections.unmodifiableSet(outOfBoundPositions);
  }
}
