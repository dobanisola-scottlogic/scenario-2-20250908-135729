package com.scottlogic.hackathon.server.models;

import com.scottlogic.hackathon.game.Bot;
import com.sleepycat.persist.model.Persistent;

@Persistent
public class TeamBot {
    private Team team;
    private Bot bot;

    public TeamBot() {
    }

    public TeamBot(final Team team, final Bot bot) {
        this.team = team;
        this.bot = bot;
    }

    public Team getTeam() {
        return team;
    }

    public Bot getBot() {
        return bot;
    }
}
