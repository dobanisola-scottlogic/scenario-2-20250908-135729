package com.scottlogic.hackathon.server.models;

import com.fasterxml.jackson.annotation.JsonView;
import com.sleepycat.persist.model.Persistent;

import java.util.Set;
import java.util.UUID;

@Persistent
public class Game {
    @JsonView(Views.List.class)
    private Long gameTime;
    @JsonView(Views.List.class)
    private Set<GameTeam> teams;
    @JsonView(Views.List.class)
    private Map map;
    private UUID hackathonId;

    public Game() {
    }

    public Game(final Set<GameTeam> teams, final Map map, final UUID hackathonId) {
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

    public UUID getHackathonId() {
        return hackathonId;
    }
}

