package com.scottlogic.hackathon.game.engine.models;

import com.scottlogic.hackathon.game.Move;
import com.scottlogic.hackathon.game.Rejection;

public class MoveRejection implements Rejection {
  private final Move move;
  private final String moveMessage;

  public MoveRejection(final Move move, final String moveMessage) {
    this.move = move;
    this.moveMessage = moveMessage;
  }

  @Override
  public String getMessage() {
    return new StringBuilder("Attempted to move ").append(moveMessage).toString();
  }

  @Override
  public String toString() {
    return new StringBuilder(getMessage()).append(": ").append(move).toString();
  }
}
