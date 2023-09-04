package com.scottlogic.hackathon.bots.move;

import com.scottlogic.hackathon.game.Direction;
import com.scottlogic.hackathon.game.GameGeometry;
import com.scottlogic.hackathon.game.Player;
import com.scottlogic.hackathon.game.Position;

public class AttackMove extends MoveBase {

  public AttackMove(final GameGeometry map, final Player fullPlayer) {
    super(map, fullPlayer);
  }

  public AttackMove(Direction direction, int distance, GameGeometry map, final Player fullPlayer) {
    super(direction, distance, map, fullPlayer);
  }

  @Override
  public void phase() {
    if (opponentPlayersPositions.size() > 0) {
      Position nearestOpponentPosition = null;
      int minDistanceSquared = ACTIVE_RADIUS_SQUARED;
      for (Position opponentPosition : opponentPlayersPositions) {
        if (findDistanceBetweenTwoPositionsSquared(playerPosition, opponentPosition)
            <= minDistanceSquared) {
          nearestOpponentPosition = opponentPosition;
          minDistanceSquared =
              findDistanceBetweenTwoPositionsSquared(playerPosition, opponentPosition);
        }
      }
      if (nearestOpponentPosition != null) {
        distance = 0;
        setDirectionNotCollidingWithOtherPlayersIn2Moves(
            getMap().directionsTowards(playerPosition, nearestOpponentPosition));
      } else {
        setRandomDirectionAndDistance(MINIMUM_RANDOM_DISTANCE, MAXIMUM_RANDOM_DISTANCE);
      }
    } else {
      setRandomDirectionAndDistance(MINIMUM_RANDOM_DISTANCE, MAXIMUM_RANDOM_DISTANCE);
    }
  }

  @Override
  public String getName() {
    return "Attack";
  }
}
