package com.scottlogic.hackathon.game.engine.models;

import java.util.Collections;
import java.util.List;
import java.util.Set;
import java.util.UUID;
import javax.persistence.Column;
import lombok.Getter;

import com.scottlogic.hackathon.game.CutoffCondition;
import com.scottlogic.hackathon.game.GameGeometry;
import com.scottlogic.hackathon.game.GameResult;
import com.scottlogic.hackathon.game.PhaseResult;
import com.scottlogic.hackathon.game.Position;

public class GameResultImpl implements GameResult {
  @Getter
  @Column(columnDefinition = "uuid")
  private final UUID id;

  private final List<PhaseResult> phaseResults;
  @Getter private final GameGeometry map;
  private final Set<Position> outOfBoundPositions;
  @Getter private final CutoffCondition cutoffCondition;

  public GameResultImpl(
          UUID id,
          List<PhaseResult> phaseResults,
          GameGeometry map,
          Set<Position> outOfBoundPositions,
          CutoffCondition cutoffCondition) {
    this.id = id;
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
