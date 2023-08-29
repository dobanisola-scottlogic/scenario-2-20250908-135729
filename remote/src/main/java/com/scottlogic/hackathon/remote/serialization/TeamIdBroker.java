package com.scottlogic.hackathon.remote.serialization;

import java.io.IOException;
import java.util.Objects;

import com.scottlogic.hackathon.remote.TeamId;

public class TeamIdBroker {
  public static String serialize(TeamId teamId) {
    Objects.requireNonNull(teamId);
    String json;
    try {
      json = JsonMapper.getMapper().writeValueAsString(teamId);
    } catch (IOException e) {
      throw new RuntimeException("Failed to serialize TeamId : " + teamId, e);
    }
    return json;
  }

  public static TeamId deserialize(String json) {
    Objects.requireNonNull(json);
    TeamId teamId;
    try {
      teamId = JsonMapper.getMapper().readValue(json, TeamId.class);
    } catch (IOException e) {
      throw new RuntimeException("Failed to deserialize TeamId : " + json, e);
    }
    return teamId;
  }
}
