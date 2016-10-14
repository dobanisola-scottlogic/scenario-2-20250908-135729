package com.scottlogic.hackathon.server.models;

public class HackathonUpdate {
    private String milestoneClassName;
    private String milestoneMap;

    public HackathonUpdate() {
    }

    public HackathonUpdate(final String milestoneClassName, final String milestoneMap){
        this.milestoneClassName = milestoneClassName;
        this.milestoneMap = milestoneMap;
    }

    public String getMilestoneClassName() {
        return milestoneClassName;
    }

    public String getMilestoneMap() {
        return milestoneMap;
    }
}
