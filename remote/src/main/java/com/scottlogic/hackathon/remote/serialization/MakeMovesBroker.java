package com.scottlogic.hackathon.remote.serialization;

import java.io.IOException;
import java.util.List;
import java.util.Objects;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.type.CollectionType;

import com.scottlogic.hackathon.game.Move;
import com.scottlogic.hackathon.game.MoveImpl;

public class MakeMovesBroker {

  public static String serialize(List<Move> moves) {
    Objects.requireNonNull(moves);
    String json;
    try {
      json = JsonMapper.getMapper().writeValueAsString(moves);
    } catch (IOException e) {
      throw new RuntimeException("Failed to serialize List<Move> : " + moves, e);
    }
    return json;
  }

  public static List<Move> deserialize(String json) {
    Objects.requireNonNull(json);
    ObjectMapper objectMapper = JsonMapper.getMapper();
    try {
      CollectionType javaType =
          objectMapper.getTypeFactory().constructCollectionType(List.class, MoveImpl.class);
      return objectMapper.readValue(json, javaType);
    } catch (IOException e) {
      throw new RuntimeException("Failed to deserialize List<Move> : " + json, e);
    }
  }
}
