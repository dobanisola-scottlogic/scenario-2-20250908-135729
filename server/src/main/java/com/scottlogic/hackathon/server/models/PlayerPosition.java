package com.scottlogic.hackathon.server.models;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.scottlogic.hackathon.game.Player;

import java.util.UUID;

public class PlayerPosition {
    @JsonIgnore
    private UUID id;
    @JsonProperty("id")
    private UUID playerId;
    private Position position;

    public PlayerPosition() {
    }

    public PlayerPosition(final UUID playerId, final Position position) {
        this.id = UUID.randomUUID();
        this.playerId = playerId;
        this.position = position;
    }

    public static PlayerPosition create(final Player player) {
        return new PlayerPosition(
                player.getId(),
                Position.create(player.getPosition())
        );
    }

    public UUID getId() {
        return id;
    }

    public Position getPosition() {
        return position;
    }

    public UUID getPlayerId() {
        return playerId;
    }
}