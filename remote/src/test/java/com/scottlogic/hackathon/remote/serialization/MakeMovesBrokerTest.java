package com.scottlogic.hackathon.remote.serialization;

import org.junit.Test;

import static org.junit.Assert.assertEquals;

public class MakeMovesBrokerTest {

  MakeMovesFixture fixture = new MakeMovesFixture();

  @Test
  public void make_moves_is_serialized() {
    assertEquals(fixture.movesJson, MakeMovesBroker.serialize(fixture.moves));
  }

  @Test
  public void make_moves_is_deserialized() {
    assertEquals(fixture.moves, MakeMovesBroker.deserialize(fixture.movesJson));
  }
}
