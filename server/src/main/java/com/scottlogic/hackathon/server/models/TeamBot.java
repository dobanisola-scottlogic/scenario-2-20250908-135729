package com.scottlogic.hackathon.server.models;

import java.util.Date;
import java.util.UUID;
import javax.persistence.Entity;
import javax.persistence.Id;
import org.joda.time.DateTime;
import org.joda.time.DateTimeZone;

@Entity
public class TeamBot {
  @Id private long id;
  private String teamId;

  private Date timeStamp;

  public TeamBot() {}

  public TeamBot(final Team team, final com.scottlogic.hackathon.game.Id id) {
    this.teamId = team.getId().toString();
    this.timeStamp = DateTime.now(DateTimeZone.UTC).toDate();
    this.id = id.getId();
  }

  public com.scottlogic.hackathon.game.Id getId() {
    return new com.scottlogic.hackathon.game.Id(id);
  }

  public void setId(final com.scottlogic.hackathon.game.Id id) {
    this.id = id.getId();
  }

  public UUID getTeamId() {
    return UUID.fromString(teamId);
  }

  public Date getTimeStamp() {
    return timeStamp;
  }
}
