package com.scottlogic.hackathon.remote.serialization;

import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.module.SimpleModule;

import com.scottlogic.hackathon.game.Id;

public class JsonMapper {

  private static final ObjectMapper mapper;

  static {
    mapper = new ObjectMapper();
    mapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
    SimpleModule module = new SimpleModule();
    module.addDeserializer(Id.class, new IdDeserializer());
    module.addSerializer(Id.class, new IdSerializer());
    mapper.registerModule(module);
  }

  public static final ObjectMapper getMapper() {
    return mapper;
  }
}
