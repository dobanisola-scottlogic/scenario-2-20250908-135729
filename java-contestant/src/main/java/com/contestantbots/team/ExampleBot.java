package com.contestantbots.team;

import java.util.ArrayList;
import java.util.List;
import com.contestantbots.util.GameStateLogger;

import com.scottlogic.hackathon.game.Bot;
import com.scottlogic.hackathon.game.GameState;
import com.scottlogic.hackathon.game.Move;

public class ExampleBot extends Bot {
  private GameStateLogger.GameStateLoggerBuilder gameStateLoggerBuilder;

  public ExampleBot(String name) {
    super(name);
    gameStateLoggerBuilder = GameStateLogger.configure(getId());
  }

  @Override
  public List<Move> makeMoves(final GameState gameState) {
    return new ArrayList<>();
  }
}
