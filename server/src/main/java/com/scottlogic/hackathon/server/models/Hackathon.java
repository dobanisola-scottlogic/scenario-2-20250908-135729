package com.scottlogic.hackathon.server.models;

import com.fasterxml.jackson.annotation.JsonView;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.OneToMany;
import java.util.List;
import java.util.UUID;

@Entity
public class Hackathon {
    @Id
    private String id;
    private String name;
    @JsonView(Views.List.class)
    @OneToMany
    private List<GameResult> games;
    @JsonView(Views.List.class)
    @OneToMany
    private List<Team> teams;
    private String currentMilestoneClassName;
    private String currentMilestoneMap;

    public Hackathon() {
    }

    public Hackathon(final String name) {
        this.id = name.toLowerCase().replace(" ", "-");
        this.name = name;
        this.currentMilestoneClassName = MilestoneBot.MILESTONE_BOT_PREFIX + "Milestone1Bot";
        this.currentMilestoneMap = "Easy";
    }

    public String getName() {
        return name;
    }

    public String getId() {
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

    public String getCurrentMilestoneClassName() {
        return currentMilestoneClassName;
    }

    public void setCurrentMilestoneClassName(String milestoneClassName){
        this.currentMilestoneClassName = milestoneClassName;
    }

    public String getCurrentMilestoneMap() {
        return currentMilestoneMap;
    }

    public void setCurrentMilestoneMap(String map) {
        this.currentMilestoneMap = map;
    }
}
