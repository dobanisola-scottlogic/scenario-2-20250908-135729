package com.scottlogic.hackathon.game.engine.models;

import com.scottlogic.hackathon.game.Collectable;
import com.scottlogic.hackathon.game.Position;

import java.util.UUID;

public class CollectableImpl implements Collectable {
    private final UUID id;
    private final Type type;
    private final Position position;

    public CollectableImpl(final Type type, final Position position) {
        this.id = UUID.randomUUID();
        this.type = type;
        this.position = position;
    }

    @Override
    public UUID getId() {
        return id;
    }

    @Override
    public Type getType() {
        return type;
    }

    @Override
    public Position getPosition() {
        return position;
    }

    public String toString() {
        return String.format("Id %s - Type %s - %s", id, type, position);
    }
}
