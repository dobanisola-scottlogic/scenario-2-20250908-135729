package com.scottlogic.hackathon.game;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;

/** A player's movement. */
@JsonDeserialize(as = MoveImpl.class)
public interface Move {
  /**
   * @return The id of the player carrying out the movement.
   */
  Id getPlayer();

  /**
   * @return The direction of the movement.
   */
  Direction getDirection();
}
