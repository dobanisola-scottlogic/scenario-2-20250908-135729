package com.scottlogic.hackathon.server.models;

import com.fasterxml.jackson.annotation.JsonView;

import java.util.UUID;

public class GameTeam {
    private UUID id;
    @JsonView(Views.List.class)
    private UUID teamId;
    @JsonView(Views.List.class)
    private String teamName;
    @JsonView(Views.Details.class)
    private UUID botId;

    public GameTeam() {
    }

    public GameTeam(final UUID id) {
        this.id = id;
    }

    public GameTeam(final UUID teamId, final String teamName, final UUID botId) {
        this(UUID.randomUUID());
        this.teamId = teamId;
        this.teamName = teamName;
        this.botId = botId;
    }

    public UUID getTeamId() {
        return teamId;
    }

    public String getTeamName() {
        return teamName;
    }

    public UUID getBotId() {
        return botId;
    }
}
