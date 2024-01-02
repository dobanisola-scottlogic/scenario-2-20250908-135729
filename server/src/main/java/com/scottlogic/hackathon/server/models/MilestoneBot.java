package com.scottlogic.hackathon.server.models;

import java.lang.reflect.InvocationTargetException;
import java.util.Date;
import java.util.UUID;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import com.fasterxml.jackson.annotation.JsonIgnore;
import org.joda.time.DateTime;
import org.joda.time.DateTimeZone;

import com.scottlogic.hackathon.game.Bot;

@Entity
public class MilestoneBot {
  @Id
  @Column(columnDefinition = "uuid")
  private UUID id;

  private String milestoneClassName;
  private Date timeStamp;

  public static final String MILESTONE_BOT_PREFIX = "com.scottlogic.hackathon.bots.";

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
      try {
          return (Bot) Class.forName(milestoneClassName).getDeclaredConstructor().newInstance();
      } catch (InstantiationException | IllegalAccessException | InvocationTargetException | NoSuchMethodException |
               ClassNotFoundException e) {
          throw new RuntimeException(String.format("Unable to instantiate bot: %s", milestoneClassName), e);
      }
  }

  public static boolean isMilestoneBot(String name) {
    return name.startsWith(MILESTONE_BOT_PREFIX);
  }
}
