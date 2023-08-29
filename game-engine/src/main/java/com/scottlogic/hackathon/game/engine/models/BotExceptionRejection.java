package com.scottlogic.hackathon.game.engine.models;

import com.scottlogic.hackathon.game.Rejection;

public class BotExceptionRejection implements Rejection {

  private final Throwable error;

  public BotExceptionRejection(Throwable error) {
    this.error = error;
  }

  @Override
  public String getMessage() {
    return String.format(
        "Bot threw exception: %s(%s)", error.getClass().getName(), error.getMessage());
  }

  @Override
  public String toString() {
    return getMessage();
  }
}
