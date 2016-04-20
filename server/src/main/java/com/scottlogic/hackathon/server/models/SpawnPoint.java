package com.scottlogic.hackathon.server.models;

import com.sleepycat.persist.model.Persistent;

import java.util.UUID;

@Persistent
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
                Position.create(spawnPoint.getPosition()));
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