package com.scottlogic.hackathon.server.models;

import com.fasterxml.jackson.annotation.JsonView;

import java.util.Set;
import java.util.UUID;

public class Game {
    private UUID id;
    @JsonView(Views.List.class)
    private Long gameTime;
    @JsonView(Views.List.class)
    private Set<GameTeam> teams;
    @JsonView(Views.List.class)
    private Map map;
    private String hackathonId;

    public Game() {
    }

    public Game(final Set<GameTeam> teams, final Map map, final String hackathonId) {
        this.id = UUID.randomUUID();
        this.gameTime = System.currentTimeMillis();
        this.teams = teams;
        this.map = map;
        this.hackathonId = hackathonId;
    }

    public Set<GameTeam> getTeams() {
        return teams;
    }

    public Map getMap() {
        return map;
    }

    public String getHackathonId() {
        return hackathonId;
    }
}

