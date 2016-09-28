package com.scottlogic.hackathon.server.models;

import java.util.Set;
import java.util.UUID;

public class GameConfiguration {
    private Set<String> teams;
    private String map;
    private UUID hackathonId;

    public GameConfiguration() {
    }

    public GameConfiguration(final Set<String> teams, final String map, final UUID hackathonId) {
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

    public UUID getHackathonId() {
        return hackathonId;
    }
}
