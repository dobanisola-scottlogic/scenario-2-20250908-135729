package com.scottlogic.hackathon.server.models;

import com.sleepycat.persist.model.Persistent;

import java.util.UUID;

@Persistent
public class Player {
    private UUID id;
    private UUID owner;

    public Player() {
    }

    public Player(final UUID id, final UUID owner) {
        this.id = id;
        this.owner = owner;
    }

    public static Player create(final com.scottlogic.hackathon.game.Player player) {
        return new Player(
                player.getId(),
                player.getOwner());
    }

    public UUID getId() {
        return id;
    }

    public UUID getOwner() {
        return owner;
    }
}