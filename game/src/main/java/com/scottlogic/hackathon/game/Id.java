package com.scottlogic.hackathon.game;

import java.io.Serializable;
import lombok.AllArgsConstructor;
import lombok.Value;

@Value
@AllArgsConstructor
public class Id implements Serializable {

  private Long id;

  @Override
  public String toString() {
    return String.valueOf(id);
  }
}
