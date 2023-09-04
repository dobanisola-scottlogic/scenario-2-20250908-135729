package com.scottlogic.hackathon.remote.serialization;

import com.scottlogic.hackathon.game.Id;
import com.scottlogic.hackathon.game.UniqueIdGenerator;
import com.scottlogic.hackathon.remote.TeamId;

public class TeamIdFixture {

  private Id id = UniqueIdGenerator.INSTANCE.next();
  private String name = "team1";
  public final String teamIdJson = String.format("{\"name\":\"%s\",\"id\":%s}", name, id);
  public final TeamId teamId = new TeamId(name, id);
}
