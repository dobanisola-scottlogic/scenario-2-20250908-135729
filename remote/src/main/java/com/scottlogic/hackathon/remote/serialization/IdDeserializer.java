package com.scottlogic.hackathon.remote.serialization;

import java.io.IOException;
import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.deser.std.StdDeserializer;

import com.scottlogic.hackathon.game.Id;

public class IdDeserializer extends StdDeserializer<Id> {
  public IdDeserializer() {
    this(null);
  }

  public IdDeserializer(Class<?> vc) {
    super(vc);
  }

  @Override
  public Id deserialize(JsonParser p, DeserializationContext ctxt) throws IOException {
    JsonNode node = p.getCodec().readTree(p);
    long id = node.asLong();
    return new Id(id);
  }
}
