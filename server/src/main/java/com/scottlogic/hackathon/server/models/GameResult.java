package com.scottlogic.hackathon.server.models;

import com.fasterxml.jackson.annotation.JsonView;
import com.sleepycat.persist.model.Entity;
import com.sleepycat.persist.model.PrimaryKey;

import java.util.*;
import java.util.stream.Collectors;

@Entity
public class GameResult {
    @PrimaryKey
    private String key;
    private UUID id;
    private Game game;
    @JsonView(Views.Details.class)
    private Set<SpawnPoint> spawnPoints;
    @JsonView(Views.Details.class)
    private List<PhaseResult> phaseResults;

    public GameResult() {
    }

    GameResult(final UUID id,
               final Game game,
               final Set<SpawnPoint> spawnPoints,
               final List<PhaseResult> phaseResults) {
        this.key = id.toString();
        this.id = id;
        this.game = game;
        this.spawnPoints = new HashSet<>(spawnPoints);
        this.phaseResults = new ArrayList<>(phaseResults);
    }

    public static GameResult create(final Game game, final com.scottlogic.hackathon.game.GameResult gameResult) {
        return new GameResult(
                gameResult.getId(),
                game,
                gameResult.getPhaseResults()
                        .stream()
                        .flatMap(phaseResult -> phaseResult.getSpawnPoints().stream())
                        .distinct()
                        .map(SpawnPoint::create)
                        .collect(Collectors.toSet()),
                gameResult
                        .getPhaseResults()
                        .stream()
                        .map(PhaseResult::create)
                        .collect(Collectors.toList())
        );
    }

    public String getKey() {
        return key;
    }

    public UUID getId() {
        return id;
    }

    public Game getGame() {
        return game;
    }

    public Set<SpawnPoint> getSpawnPoints() {
        return Collections.unmodifiableSet(spawnPoints);
    }

    public List<PhaseResult> getPhaseResults() {
        return Collections.unmodifiableList(phaseResults);
    }


}