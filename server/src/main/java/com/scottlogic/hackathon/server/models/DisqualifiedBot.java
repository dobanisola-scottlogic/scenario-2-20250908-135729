package com.scottlogic.hackathon.server.models;

import java.util.UUID;

public class DisqualifiedBot {
    private UUID id;
    private String reason;

    public DisqualifiedBot(){}

    public DisqualifiedBot(UUID id, String reason) {
        this.id = id;
        this.reason = reason;
    }

    public UUID getId() {
        return id;
    }

    public String getReason() {
        return reason;
    }

}
