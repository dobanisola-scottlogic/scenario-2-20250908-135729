package com.scottlogic.hackathon.server.models;

import java.util.List;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import com.fasterxml.jackson.annotation.JsonRawValue;
import com.fasterxml.jackson.annotation.JsonView;
import com.fasterxml.jackson.core.JsonProcessingException;

import com.scottlogic.hackathon.game.CutoffCondition;
import com.scottlogic.hackathon.game.engine.ShortIdGenerator;
import com.scottlogic.hackathon.remote.serialization.JsonMapper;

@Entity
public class GameResult {
  @Id
  @Column(columnDefinition = "uuid")
  private UUID id;

  @JsonRawValue
  @Column(columnDefinition = "TEXT")
  private String game;

  @JsonView(Views.Details.class)
  @JsonRawValue
  @Column(columnDefinition = "TEXT")
  private String spawnPoints;

  @JsonView(Views.Details.class)
  @JsonRawValue
  @Column(columnDefinition = "TEXT")
  private String phaseResults;

  private String hackathonId;
  private CutoffCondition cutoffCondition;

  public GameResult() {}

  GameResult(
      final UUID id,
      final String game,
      final String spawnPoints,
      final String phaseResults,
      final String hackathonId,
      final CutoffCondition cutoffCondition) {
    this.id = id;
    this.game = game;
    this.spawnPoints = spawnPoints;
    this.phaseResults = phaseResults;
    this.hackathonId = hackathonId;
    this.cutoffCondition = cutoffCondition;
  }

  public static GameResult create(
      ShortIdGenerator idGen,
      final Game game,
      final com.scottlogic.hackathon.game.GameResult gameResult) {
    Set<SpawnPoint> spawnPoints =
        gameResult.getPhaseResults().stream()
            .flatMap(phaseResult -> phaseResult.getSpawnPoints().stream())
            .distinct()
            .map(SpawnPoint::create)
            .collect(Collectors.toSet());

    List<PhaseResult> phaseResults =
        gameResult.getPhaseResults().stream()
            .map(p -> PhaseResult.create(idGen, p))
            .collect(Collectors.toList());

    String gameStr = "";
    String spawnPointsStr = "";
    String phaseResultsStr = "";

    try {
      gameStr = JsonMapper.getMapper().writeValueAsString(game);
      spawnPointsStr = JsonMapper.getMapper().writeValueAsString(spawnPoints);
      phaseResultsStr = JsonMapper.getMapper().writeValueAsString(phaseResults);
    } catch (JsonProcessingException e) {
      e.printStackTrace();
    }

    return new GameResult(
        gameResult.getId(),
        gameStr,
        spawnPointsStr,
        phaseResultsStr,
        game.getHackathonId(),
        gameResult.getCutoffCondition());
  }

  public UUID getId() {
    return id;
  }

  public String getGame() {
    return game;
  }

  public String getSpawnPoints() {
    return spawnPoints;
  }

  public String getPhaseResults() {
    return phaseResults;
  }

  public CutoffCondition getCutoffCondition() {
    return cutoffCondition;
  }
}
