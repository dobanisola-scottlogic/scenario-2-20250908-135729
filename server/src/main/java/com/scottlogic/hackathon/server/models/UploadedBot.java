package com.scottlogic.hackathon.server.models;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.google.common.io.ByteStreams;
import com.scottlogic.hackathon.game.Bot;
import com.scottlogic.hackathon.server.services.RemoteClassLoader;
import com.sleepycat.persist.model.DeleteAction;
import com.sleepycat.persist.model.Entity;
import com.sleepycat.persist.model.PrimaryKey;
import com.sleepycat.persist.model.Relationship;
import com.sleepycat.persist.model.SecondaryKey;
import org.joda.time.DateTime;
import org.joda.time.DateTimeZone;

import java.io.IOException;
import java.io.InputStream;
import java.util.Date;
import java.util.UUID;

@Entity
public class UploadedBot {
    @SecondaryKey(relate = Relationship.MANY_TO_ONE, relatedEntity = Team.class, onRelatedEntityDelete=DeleteAction.CASCADE)
    String teamId;
    @PrimaryKey()
    private String key;
    private UUID id;
    private byte[] data;
    private String botClassName;
    private Date timeStamp;

    public UploadedBot() {

    }

    public UploadedBot(final Team team) {
        this.teamId = team.getId().toString();
        this.timeStamp = DateTime.now(DateTimeZone.UTC).toDate();
        setId(UUID.randomUUID());
    }

    public UUID getId() {
        return id;
    }

    public void setId(final UUID id) {
        this.id = id;
        this.key = id.toString();
    }

    public UUID getTeamId() {
        return UUID.fromString(teamId);
    }

    public Date getTimeStamp() {
        return timeStamp;
    }

    public String getBotClassName() {
        return botClassName;
    }

    public void setBotClassName(final String botClassName) {
        this.botClassName = botClassName;
    }

    public void setData(final InputStream inputStream) {
        try {
            this.data = ByteStreams.toByteArray(inputStream);
        } catch (final IOException e) {
            e.printStackTrace();
        }
    }

    @JsonIgnore
    public Bot getBot() {
        Bot loadedBot = null;

        final RemoteClassLoader remoteClassLoader = new RemoteClassLoader(data);
        try {
            loadedBot = (Bot) remoteClassLoader.loadClass(botClassName).newInstance();
        } catch (final ClassNotFoundException | InstantiationException | IllegalAccessException e) {
            e.printStackTrace();
        }

        return loadedBot;
    }
}