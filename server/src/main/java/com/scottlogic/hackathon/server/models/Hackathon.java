package com.scottlogic.hackathon.server.models;

import com.fasterxml.jackson.annotation.JsonProperty;

public class Hackathon {
    private String name;

    public Hackathon() {
    }

    public Hackathon(final String name) {
        this.name = name;
    }

    public String getName() {
        return name;
    }

}
