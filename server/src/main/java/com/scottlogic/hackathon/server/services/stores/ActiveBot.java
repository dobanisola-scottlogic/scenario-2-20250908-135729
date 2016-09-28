package com.scottlogic.hackathon.server.services.stores;

import com.scottlogic.hackathon.server.models.UploadedBot;
import com.sleepycat.persist.model.DeleteAction;
import com.sleepycat.persist.model.Entity;
import com.sleepycat.persist.model.PrimaryKey;
import com.sleepycat.persist.model.Relationship;
import com.sleepycat.persist.model.SecondaryKey;

import java.util.UUID;

@Entity
public class ActiveBot {
    @PrimaryKey()
    private String teamId;
    @SecondaryKey(relate = Relationship.ONE_TO_ONE, relatedEntity = UploadedBot.class, onRelatedEntityDelete= DeleteAction.CASCADE)
    private String botId;

    ActiveBot() {

    }

    public ActiveBot(final UploadedBot uploadedBot) {
        this.botId = uploadedBot.getId().toString();
        this.teamId = uploadedBot.getTeamId().toString();
    }

    public UUID getTeamId() {
        return UUID.fromString(teamId);
    }

    public UUID getBotId() {
        return UUID.fromString(botId);
    }
}
