package com.scottlogic.hackathon.server.models;

import java.util.UUID;

public class Collectable {
    private UUID id;
    private int type;
    private Position position;

    public Collectable() {
    }

    public Collectable(final UUID id, final int type, final Position position) {
        this.id = id;
        this.type = type;
        this.position = position;
    }

    public static Collectable create(final com.scottlogic.hackathon.game.Collectable collectable) {
        return new Collectable(
                collectable.getId(),
                collectable.getType().ordinal(),
                Position.create(collectable.getPosition()));
    }

    public UUID getId() {
        return id;
    }

    public int getType() {
        return type;
    }

    public Position getPosition() {
        return position;
    }
}