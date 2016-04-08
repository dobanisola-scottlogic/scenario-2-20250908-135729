package com.scottlogic.hackathon.game.engine.models;

import com.scottlogic.hackathon.game.Player;
import com.scottlogic.hackathon.game.Position;

import java.util.UUID;

public class PlayerImpl implements Player {
    private final UUID id;
    private final UUID owner;
    private final Position position;

    public PlayerImpl(final UUID owner, final Position position) {
        this(UUID.randomUUID(), owner, position);
    }

    private PlayerImpl(final UUID id, final UUID owner, final Position position) {
        this.id = id;
        this.owner = owner;
        this.position = position;
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

    public String toString() {
        return String.format("Id %s - Owner %s - %s", id, owner, position);
    }

    public PlayerImpl move(final Position position) {
        return new PlayerImpl(id, owner, position);
    }
}
