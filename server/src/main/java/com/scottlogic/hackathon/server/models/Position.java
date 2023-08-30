package com.scottlogic.hackathon.server.models;

import javax.persistence.Embeddable;

@Embeddable
public class Position {
  private int x;
  private int y;

  Position() {}

  public Position(final int x, final int y) {
    this.x = x;
    this.y = y;
  }

  public static Position create(final com.scottlogic.hackathon.game.Position position) {
    return new Position(position.getX(), position.getY());
  }

  public int getX() {
    return x;
  }

  public int getY() {
    return y;
  }
}
