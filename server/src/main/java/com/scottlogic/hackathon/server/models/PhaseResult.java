package com.scottlogic.hackathon.server.models;

import com.fasterxml.jackson.annotation.JsonView;
import com.sleepycat.persist.model.Persistent;

import java.util.Collections;
import java.util.HashSet;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

@Persistent
public class PhaseResult {
    @JsonView(Views.List.class)
    private int phase;
    @JsonView(Views.Details.class)
    private Set<PlayerPosition> playerPositions;
    @JsonView(Views.Details.class)
    private Set<Player> addedPlayers;
    @JsonView(Views.Details.class)
    private Set<Collectable> addedCollectables;
    @JsonView(Views.Details.class)
    private Set<UUID> removedPlayers;
    @JsonView(Views.Details.class)
    private Set<UUID> removedSpawnPoints;
    @JsonView(Views.Details.class)
    private Set<UUID> removedCollectables;

    public PhaseResult() {
    }

    public PhaseResult(final int phase,
                       final Set<PlayerPosition> playerPositions,
                       final Set<Player> addedPlayers,
                       final Set<Collectable> addedCollectables,
                       final Set<UUID> removedPlayers,
                       final Set<UUID> removedSpawnPoints,
                       final Set<UUID> removedCollectables) {
        this.phase = phase;
        this.playerPositions = new HashSet<>(playerPositions);
        this.addedPlayers = new HashSet<>(addedPlayers);
        this.addedCollectables = new HashSet<>(addedCollectables);
        this.removedPlayers = new HashSet<>(removedPlayers);
        this.removedSpawnPoints = new HashSet<>(removedSpawnPoints);
        this.removedCollectables = new HashSet<>(removedCollectables);
    }

    public static PhaseResult create(final com.scottlogic.hackathon.game.PhaseResult phaseResult) {
        return new PhaseResult(
                phaseResult.getPhase(),
                phaseResult.getPlayers()
                        .stream()
                        .map(PlayerPosition::create)
                        .collect(Collectors.toSet()),
                phaseResult.getPlayers()
                        .getAdded()
                        .stream()
                        .map(Player::create)
                        .collect(Collectors.toSet()),
                phaseResult.getCollectables()
                        .getAdded()
                        .stream()
                        .map(Collectable::create)
                        .collect(Collectors.toSet()),
                phaseResult.getPlayers()
                        .getRemoved()
                        .stream()
                        .map(com.scottlogic.hackathon.game.Player::getId)
                        .collect(Collectors.toSet()),
                phaseResult.getSpawnPoints()
                        .getRemoved()
                        .stream()
                        .map(com.scottlogic.hackathon.game.SpawnPoint::getId)
                        .collect(Collectors.toSet()),
                phaseResult.getCollectables()
                        .getRemoved()
                        .stream()
                        .map(com.scottlogic.hackathon.game.Collectable::getId)
                        .collect(Collectors.toSet())

        );
    }

    public int getPhase() {
        return phase;
    }

    public Set<PlayerPosition> getPlayerPositions() {
        return Collections.unmodifiableSet(playerPositions);
    }

    public Set<Player> getAddedPlayers() {
        return Collections.unmodifiableSet(addedPlayers);
    }

    public Set<Collectable> getAddedCollectables() {
        return Collections.unmodifiableSet(addedCollectables);
    }

    public Set<UUID> getRemovedPlayers() {
        return Collections.unmodifiableSet(removedPlayers);
    }

    public Set<UUID> getRemovedSpawnPoints() {
        return Collections.unmodifiableSet(removedSpawnPoints);
    }

    public Set<UUID> getRemovedCollectables() {
        return Collections.unmodifiableSet(removedCollectables);
    }


}