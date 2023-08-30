package com.scottlogic.hackathon.remote.serialization;

import java.io.IOException;
import java.util.Objects;

import com.scottlogic.hackathon.game.*;

public class GameStateBroker {

  public static String serialize(GameState gameState) {
    Objects.requireNonNull(gameState);
    try {
      return JsonMapper.getMapper().writeValueAsString(gameState);
    } catch (IOException e) {
      throw new RuntimeException("Failed to serialize GameState : " + gameState, e);
    }
  }

  public static GameState deserialize(String json) {
    Objects.requireNonNull(json);
    try {
      return JsonMapper.getMapper().readValue(json, GameState.class);
    } catch (IOException e) {
      throw new RuntimeException("Failed to deserialize GameState : " + json, e);
    }
  }
}
