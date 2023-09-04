package com.scottlogic.hackathon.remote.serialization;

import org.junit.Test;

import static org.junit.Assert.assertEquals;

public class GameStateBrokerTest {

  GameStateFixture fixture = new GameStateFixture();

  @Test
  public void game_state_is_serialized() {
    assertEquals(fixture.gameStateJson, GameStateBroker.serialize(fixture.gameState));
  }

  @Test
  public void game_state_is_deserialized() {
    assertEquals(fixture.gameState, GameStateBroker.deserialize(fixture.gameStateJson));
  }
}
