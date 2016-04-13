package com.scottlogic.hackathon.server.models;

import com.scottlogic.hackathon.game.Position;

import java.util.UUID;

public class SpawnPoint {
    private UUID id;
    private UUID owner;
    private Position position;

    public SpawnPoint() {
    }

    public SpawnPoint(final UUID id, final UUID owner, final Position position) {
        this.id = id;
        this.owner = owner;
        this.position = position;
    }

    public static SpawnPoint create(final com.scottlogic.hackathon.game.SpawnPoint spawnPoint) {
        return new SpawnPoint(
                spawnPoint.getId(),
                spawnPoint.getOwner(),
                spawnPoint.getPosition());
    }

    public UUID getId() {
        return id;
    }

    public UUID getOwner() {
        return owner;
    }

    public Position getPosition() {
        return position;
    }
}
