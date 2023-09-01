package com.scottlogic.hackathon.bots.move;

import java.util.List;
import java.util.stream.Collectors;

import com.scottlogic.hackathon.game.*;

public class HunterMove extends MoveBase {

  private int largestMapRadius;

  public HunterMove(GameGeometry map, final Player fullPlayer) {
    super(map, fullPlayer);
    this.largestMapRadius = determineLargestMapRadius(map);
  }

  public HunterMove(Direction direction, int distance, GameGeometry map, final Player fullPlayer) {
    super(direction, distance, map, fullPlayer);
    this.largestMapRadius = determineLargestMapRadius(map);
  }

  private static int determineLargestMapRadius(GameGeometry map) {
    return (int) Math.pow(Math.max(map.getWidth(), map.getHeight()), 2);
  }

  @Override
  public void phase() {
    if (opponentSpawnPoints.size() > 0) {
      List<Position> opponentSpawnPointsPositions =
          opponentSpawnPoints.stream().map(SpawnPoint::getPosition).collect(Collectors.toList());
      Position nearestOpponentSpawnPointPosition = null;
      int minDistanceSquared = largestMapRadius;
      for (Position opponentSpawnPointsPosition : opponentSpawnPointsPositions) {
        if (findDistanceBetweenTwoPositionsSquared(playerPosition, opponentSpawnPointsPosition)
            <= minDistanceSquared) {
          nearestOpponentSpawnPointPosition = opponentSpawnPointsPosition;
          minDistanceSquared =
              findDistanceBetweenTwoPositionsSquared(
                  playerPosition, nearestOpponentSpawnPointPosition);
        }
      }
      if (nearestOpponentSpawnPointPosition != null) {
        distance = 0;
        setDirectionNotCollidingWithOtherPlayersIn2Moves(
            getMap().directionsTowards(playerPosition, nearestOpponentSpawnPointPosition));
      } else {
        setRandomDirectionAndDistance(MINIMUM_RANDOM_DISTANCE, MAXIMUM_RANDOM_DISTANCE);
      }
    } else {
      setRandomDirectionAndDistance(MINIMUM_RANDOM_DISTANCE, MAXIMUM_RANDOM_DISTANCE);
    }
  }

  @Override
  public String getName() {
    return "Hunter";
  }
}
