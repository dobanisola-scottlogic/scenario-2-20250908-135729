package com.scottlogic.hackathon.game;

import lombok.AllArgsConstructor;
import lombok.Value;

/** A player (minion) in the game. */
@Value
@AllArgsConstructor
public class Player {
  /**
   * @return The unique id of the current player.
   */
  Id id;

  /**
   * @return The unique id of the owner of the current player.
   */
  Id owner;

  /**
   * @return The position of the current player.
   */
  Position position;

  public Player move(final Position position) {
    return new Player(id, owner, position);
  }
}
