package com.scottlogic.hackathon.game.engine.models;

import com.scottlogic.hackathon.game.Position;
import com.scottlogic.hackathon.game.SpawnPoint;

import java.util.Objects;
import java.util.UUID;

public class SpawnPointImpl implements SpawnPoint {
    private final UUID id;
    private final Position position;
    private final UUID owner;
    private int queuedPlayers;

    public SpawnPointImpl(final Position position, final UUID owner, final int initialPlayers) {
        this.id = UUID.randomUUID();
        this.position = position;
        this.owner = owner;
        this.queuedPlayers = initialPlayers;
    }

    @Override
    public UUID getId() {
        return id;
    }

    @Override
    public UUID getOwner() {
        return owner;
    }

    @Override
    public Position getPosition() {
        return position;
    }

    @Override
    public String toString() {
        return String.format("Id %s - Owner %s - %s", id, owner, position);
    }

    @Override
    public void queuePlayer() {
        queuedPlayers++;
    }

    public boolean shouldSpawnPlayer() {
        final boolean shouldSpawnPlayer = queuedPlayers > 0;
        if (shouldSpawnPlayer) {
            queuedPlayers--;
        }

        return shouldSpawnPlayer;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        return Objects.equals(id, ((SpawnPointImpl) o).id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }
}
