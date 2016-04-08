package com.scottlogic.hackathon.game.engine.models;

import com.scottlogic.hackathon.game.Position;
import com.scottlogic.hackathon.game.SpawnPoint;

import java.util.UUID;

public class SpawnPointImpl implements SpawnPoint {
    private final UUID id;
    private final Position position;
    private final UUID owner;

    public SpawnPointImpl(final Position position, final UUID owner) {
        this.id = UUID.randomUUID();
        this.position = position;
        this.owner = owner;
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

}
