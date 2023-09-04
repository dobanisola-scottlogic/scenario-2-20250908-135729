package com.scottlogic.hackathon.server.models;

import lombok.Getter;

import com.scottlogic.hackathon.game.Id;

public class Collectable {
  @Getter private Id id;
  @Getter private int type;
  @Getter private Position position;

  public Collectable() {}

  public Collectable(final Id id, final int type, final Position position) {
    this.id = id;
    this.type = type;
    this.position = position;
  }

  public static Collectable create(final com.scottlogic.hackathon.game.Collectable collectable) {
    return new Collectable(
        collectable.getId(),
        collectable.getType().ordinal(),
        Position.create(collectable.getPosition()));
  }
}
