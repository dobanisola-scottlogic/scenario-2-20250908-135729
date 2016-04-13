package com.scottlogic.hackathon.server.models;

import com.scottlogic.hackathon.game.Player;
import com.scottlogic.hackathon.game.Position;

import java.util.UUID;

public class PlayerPosition {
    private UUID id;
    private Position position;

    public PlayerPosition() {
    }

    public PlayerPosition(final UUID id, final Position position) {
        this.id = id;
        this.position = position;
    }

    public static PlayerPosition create(final Player player) {
        return new PlayerPosition(
                player.getId(),
                player.getPosition()
        );
    }

    public UUID getId() {
        return id;
    }

    public Position getPosition() {
        return position;
    }
}
