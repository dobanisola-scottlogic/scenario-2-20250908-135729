package com.scottlogic.hackathon.server.models;

import com.fasterxml.jackson.annotation.JsonView;
import com.sleepycat.persist.model.Persistent;

import java.util.Set;

@Persistent
public class Game {
    @JsonView(Views.List.class)
    private Set<GameTeam> teams;
    @JsonView(Views.List.class)
    private Map map;

    public Game() {
    }

    public Game(final Set<GameTeam> teams, final Map map) {
        this.teams = teams;
        this.map = map;
    }

    public Set<GameTeam> getTeams() {
        return teams;
    }

    public Map getMap() {
        return map;
    }
}

