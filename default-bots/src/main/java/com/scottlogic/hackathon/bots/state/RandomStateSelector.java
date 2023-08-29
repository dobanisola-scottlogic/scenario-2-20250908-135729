package com.scottlogic.hackathon.bots.state;

import java.util.Random;
import java.util.stream.IntStream;

import com.scottlogic.hackathon.bots.move.*;
import com.scottlogic.hackathon.game.GameGeometry;
import com.scottlogic.hackathon.game.Player;

public class RandomStateSelector {

  private static final int ATTACK = 20;
  private static final int COLLECTABLE = 80;
  private static final int DEFEND = 0;
  private static final int HUNTER = 10;
  private static final int TIMID = 0;
  private static final int[] STATEPROPORTIONS =
      new int[] {ATTACK, COLLECTABLE, DEFEND, HUNTER, TIMID};

  private MoveBase move;

  public RandomStateSelector(GameGeometry map, Player player) {
    // Determines which bot is selected
    int stateProportionsSum = IntStream.of(STATEPROPORTIONS).sum();
    int randomState = new Random().nextInt(stateProportionsSum);
    if (randomState < STATEPROPORTIONS[0]) {
      this.move = new AttackMove(map, player);
    } else if (randomState < STATEPROPORTIONS[0] + STATEPROPORTIONS[1]) {
      this.move = new CollectableMove(map, player);
    } else if (randomState < STATEPROPORTIONS[0] + STATEPROPORTIONS[1] + STATEPROPORTIONS[2]) {
      this.move = new DefendMove(map, player);
    } else if (randomState
        < STATEPROPORTIONS[0] + STATEPROPORTIONS[1] + STATEPROPORTIONS[2] + STATEPROPORTIONS[3]) {
      this.move = new HunterMove(map, player);
    } else {
      this.move = new TimidMove(map, player);
    }
  }

  public MoveBase getMove() {
    return move;
  }
}
