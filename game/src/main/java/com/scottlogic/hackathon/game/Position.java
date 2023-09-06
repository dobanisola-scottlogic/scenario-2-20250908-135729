package com.scottlogic.hackathon.game;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Value;

/** A position in (x, y) coordinate space - (0, 0) being top-left. */
@Value
public class Position {
  /**
   * @return the X coordinate of this Position
   */
  int x;

  /**
   * @return the Y coordinate of this Position
   */
  int y;

  /**
   * Constructs and initialises a position at the specified coordinates. This does not perform any
   * checking of whether the given coordinates are within the bounds of a particular {@linkplain
   * GameGeometry}, and will throw an exception if either coordinate is negative. Consider using
   * {@link GameGeometry#getPosition(int, int)} instead of this constructor for a safer way of
   * creating positions.
   *
   * @param x the X coordinate of the newly constructed Position
   * @param y the Y coordinate of the newly constructed Position
   * @throws IllegalArgumentException if either given value is less than 0
   * @see GameGeometry#getPosition(int, int)
   */
  public Position(@JsonProperty("x") final int x, @JsonProperty("y") final int y)
      throws IllegalArgumentException {
    if (x < 0) {
      throw new IllegalArgumentException("x must be >= 0");
    }
    if (y < 0) {
      throw new IllegalArgumentException("y must be >= 0");
    }
    this.x = x;
    this.y = y;
  }
}
