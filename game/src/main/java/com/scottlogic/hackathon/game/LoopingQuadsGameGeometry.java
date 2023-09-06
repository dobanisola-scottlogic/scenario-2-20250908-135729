package com.scottlogic.hackathon.game;

import lombok.Value;

@Value
public class LoopingQuadsGameGeometry implements GameGeometry {
  int width;
  int height;

  @Override
  public Position getRelativePosition(Position from, Direction direction, int distance) {
    int x = from.getX();
    int y = from.getY();

    if (direction.isEastward()) {
      x += distance;
    } else if (direction.isWestward()) {
      x -= distance;
    }

    if (direction.isNorthward()) {
      y -= distance;
    } else if (direction.isSouthward()) {
      y += distance;
    }

    return getPosition(x, y);
  }

  @Override
  public int xDistance(Position a, Position b) {
    return directedDistance(a.getX(), b.getX(), getWidth());
  }

  @Override
  public int yDistance(Position a, Position b) {
    return directedDistance(a.getY(), b.getY(), getHeight());
  }

  private int directedDistance(int a, int b, int extent) {
    int d = Math.abs(b - a);
    return d > extent / 2 ? extent - d : d;
  }

  public Position getPosition(int x, int y) {
    return new Position(Math.floorMod(x, getWidth()), Math.floorMod(y, getHeight()));
  }
}
