package com.scottlogic.hackathon.server.models;

import com.sleepycat.persist.model.Entity;
import com.sleepycat.persist.model.PrimaryKey;

import java.util.*;
import java.util.stream.Collectors;

@Entity
public class GameResult {
    @PrimaryKey
    private String key;
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
        this.key = id.toString();
        this.id = id;
        this.map = map;
        this.spawnPoints = new HashSet<>(spawnPoints);
        this.phaseResults = new ArrayList<>(phaseResults);
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

    public String getKey() {
        return key;
    }

    public UUID getId() {
        return id;
    }

    public Map getMap() {
        return map;
    }

    public Set<SpawnPoint> getSpawnPoints() {
        return Collections.unmodifiableSet(spawnPoints);
    }

    public List<PhaseResult> getPhaseResults() {
        return Collections.unmodifiableList(phaseResults);
    }

}