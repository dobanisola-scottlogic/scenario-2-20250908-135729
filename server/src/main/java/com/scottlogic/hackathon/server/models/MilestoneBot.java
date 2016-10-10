package com.scottlogic.hackathon.server.models;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.scottlogic.hackathon.game.Bot;
import com.sleepycat.persist.model.Entity;
import com.sleepycat.persist.model.PrimaryKey;
import org.joda.time.DateTime;
import org.joda.time.DateTimeZone;

import java.util.Date;
import java.util.UUID;

@Entity
public class MilestoneBot {
    @PrimaryKey()
    private String key;
    private UUID id;
    private String milestoneClassName;
    private Date timeStamp;

    public MilestoneBot() {}

    public MilestoneBot(Bot bot) {
        setMilestoneClassName(bot.getClass().getName());
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

    public Date getTimeStamp() {
        return timeStamp;
    }

    public String getMilestoneClassName() {
        return milestoneClassName;
    }

    public void setMilestoneClassName(final String milestoneClassName) {
        this.milestoneClassName = milestoneClassName;
    }

    @JsonIgnore
    public Bot getBot() {
        Bot milestoneBot = null;
        try {
            milestoneBot = (Bot) Class.forName(milestoneClassName).newInstance();
        }
        catch (final ClassNotFoundException | InstantiationException | IllegalAccessException e){
            e.printStackTrace();
        }
        return milestoneBot;
    }

}