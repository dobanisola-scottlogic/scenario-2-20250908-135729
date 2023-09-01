package com.scottlogic.hackathon.game;

import lombok.AllArgsConstructor;
import lombok.Value;

/** A collectable item in the game. */
@Value
@AllArgsConstructor
public class Collectable {
  /**
   * @return The unique id of the current collectable item.
   */
  Id id;

  /**
   * @return the type of the current collectable item.
   */
  Type type;

  /**
   * @return The position of the collectable item.
   */
  Position position;

  /** Collectable item types */
  public enum Type {
    /** Item that generates a new player */
    PLAYER
  }
}
