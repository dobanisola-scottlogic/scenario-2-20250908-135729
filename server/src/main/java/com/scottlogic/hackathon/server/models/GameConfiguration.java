package com.scottlogic.hackathon.server.models;

import java.util.Set;
import java.util.UUID;

public class GameConfiguration {
    private Set<String> teams;
    private String map;
    private String hackathonId;

    public GameConfiguration() {
    }

    public GameConfiguration(final Set<String> teams, final String map, final String hackathonId) {
        this.teams = teams;
        this.map = map;
        this.hackathonId = hackathonId;
    }

    public Set<String> getTeams() {
        return teams;
    }

    public String getMap() {
        return map;
    }

    public String getHackathonId() {
        return hackathonId;
    }
}
