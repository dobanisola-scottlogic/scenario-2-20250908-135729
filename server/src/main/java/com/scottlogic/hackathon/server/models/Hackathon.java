package com.scottlogic.hackathon.server.models;

import com.fasterxml.jackson.annotation.JsonView;
import com.sleepycat.persist.model.Entity;
import com.sleepycat.persist.model.PrimaryKey;

import java.util.List;
import java.util.UUID;

@Entity
public class Hackathon {
    @PrimaryKey
    private String key;
    private UUID id;
    private String name;
    @JsonView(Views.List.class)
    private List<GameResult> games;
    @JsonView(Views.List.class)
    private List<Team> teams;

    public Hackathon() {
    }

    public Hackathon(final String name) {
        this.id = UUID.randomUUID();
        this.key = this.id.toString();
        this.name = name;
    }

    public String getName() {
        return name;
    }

    public UUID getId() {
        return this.id;
    }

    public List<GameResult> getGames() {
        return this.games;
    }

    public void setGames(List<GameResult> games) {
        this.games = games;
    }

    public List<Team> getTeams() {
        return this.teams;
    }

    public void setTeams(List<Team> teams) {
        this.teams = teams;
    }
}
