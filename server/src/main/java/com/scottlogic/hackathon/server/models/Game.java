package com.scottlogic.hackathon.server.models;

import com.sleepycat.persist.model.Persistent;

import java.util.Set;

@Persistent
public class Game {
    private Set<TeamBot> teamBots;
    private Map map;

    public Game() {
    }

    public Game(final Set<TeamBot> teamBots, final Map map) {
        this.teamBots = teamBots;
        this.map = map;
    }

    public Set<TeamBot> getTeamBots() {
        return teamBots;
    }

    public Map getMap() {
        return map;
    }
}

