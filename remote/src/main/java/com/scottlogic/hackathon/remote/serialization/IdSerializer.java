package com.scottlogic.hackathon.remote.serialization;

import java.io.IOException;
import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.databind.SerializerProvider;
import com.fasterxml.jackson.databind.ser.std.StdSerializer;

import com.scottlogic.hackathon.game.Id;

class IdSerializer extends StdSerializer<Id> {

  public IdSerializer() {
    this(null);
  }

  public IdSerializer(Class<Id> i) {
    super(i);
  }

  @Override
  public void serialize(Id value, JsonGenerator gen, SerializerProvider provider)
      throws IOException {
    gen.writeNumber(value.getId());
  }
}
