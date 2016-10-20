package com.scottlogic.hackathon.server.services.stores;

import java.util.UUID;

public class ActiveBot {
    private String teamId;
    private String botId;

    public UUID getTeamId() {
        return UUID.fromString(teamId);
    }

    public UUID getBotId() {
        return UUID.fromString(botId);
    }
}
