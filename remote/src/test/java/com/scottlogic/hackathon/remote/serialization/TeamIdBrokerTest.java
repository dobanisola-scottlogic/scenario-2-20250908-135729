package com.scottlogic.hackathon.remote.serialization;

import org.junit.Test;

import static org.junit.Assert.assertEquals;

public class TeamIdBrokerTest {
  TeamIdFixture fixture = new TeamIdFixture();

  @Test
  public void team_id_is_serialized() {
    assertEquals(fixture.teamIdJson, TeamIdBroker.serialize(fixture.teamId));
  }

  @Test
  public void team_id_is_deserialized() {
    assertEquals(fixture.teamId, TeamIdBroker.deserialize(fixture.teamIdJson));
  }
}
