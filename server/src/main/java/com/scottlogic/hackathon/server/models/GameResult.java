package com.scottlogic.hackathon.server.models;

import java.util.List;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

public class GameResult {
    private UUID id;
    private Map map;
    private Set<SpawnPoint> spawnPoints;
    private List<PhaseResult> phaseResults;

    public GameResult() {
    }

    GameResult(final UUID id,
               final Map map,
               final Set<SpawnPoint> spawnPoints,
               final List<PhaseResult> phaseResults) {
        this.id = id;
        this.map = map;
        this.spawnPoints = spawnPoints;
        this.phaseResults = phaseResults;
    }

    public static GameResult create(final com.scottlogic.hackathon.game.GameResult gameResult) {
        return new GameResult(
                gameResult.getId(),
                Map.create(gameResult),
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

    public UUID getId() {
        return id;
    }

    public Map getMap() {
        return map;
    }

    public Set<SpawnPoint> getSpawnPoints() {
        return spawnPoints;
    }

    public List<PhaseResult> getPhaseResults() {
        return phaseResults;
    }

}
