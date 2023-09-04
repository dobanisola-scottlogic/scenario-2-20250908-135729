package com.scottlogic.hackathon.game.engine.models;

import java.util.Collections;
import java.util.List;

import com.scottlogic.hackathon.game.Bot;
import com.scottlogic.hackathon.game.DisqualifiedBot;
import com.scottlogic.hackathon.game.Rejection;

public class DisqualifiedBotImpl implements DisqualifiedBot {
  private final Bot bot;
  private final List<Rejection> rejections;

  public DisqualifiedBotImpl(final Bot bot, final List<Rejection> rejections) {
    if (rejections.isEmpty()) {
      throw new IllegalArgumentException(
          "Bot cannot be disqualified without a reason: " + bot.getId());
    }
    this.bot = bot;
    this.rejections = rejections;
  }

  public List<Rejection> getRejections() {
    return Collections.unmodifiableList(rejections);
  }

  public Bot getBot() {
    return bot;
  }
}
