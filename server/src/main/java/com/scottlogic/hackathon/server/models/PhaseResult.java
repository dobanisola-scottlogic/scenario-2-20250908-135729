package com.scottlogic.hackathon.server.models;

import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

public class PhaseResult {
    private int phase;
    private Set<PlayerPosition> playerPositions;
    private Set<Player> addedPlayers;
    private Set<Collectable> addedCollectables;
    private Set<UUID> removedPlayers;
    private Set<UUID> removedSpawnPoints;
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
        this.playerPositions = playerPositions;
        this.addedPlayers = addedPlayers;
        this.addedCollectables = addedCollectables;
        this.removedPlayers = removedPlayers;
        this.removedSpawnPoints = removedSpawnPoints;
        this.removedCollectables = removedCollectables;
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
        return playerPositions;
    }

    public Set<Player> getAddedPlayers() {
        return addedPlayers;
    }

    public Set<Collectable> getAddedCollectables() {
        return addedCollectables;
    }

    public Set<UUID> getRemovedPlayers() {
        return removedPlayers;
    }

    public Set<UUID> getRemovedSpawnPoints() {
        return removedSpawnPoints;
    }

    public Set<UUID> getRemovedCollectables() {
        return removedCollectables;
    }


}
