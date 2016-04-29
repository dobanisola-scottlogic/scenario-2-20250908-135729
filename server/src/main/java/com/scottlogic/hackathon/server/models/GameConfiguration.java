package com.scottlogic.hackathon.server.models;

import java.util.Set;

public class GameConfiguration {
    private Set<String> teams;
    private String map;

    public GameConfiguration() {
    }

    public GameConfiguration(final Set<String> teams, final String map) {
        this.teams = teams;
        this.map = map;
    }

    public Set<String> getTeams() {
        return teams;
    }

    public String getMap() {
        return map;
    }
}
