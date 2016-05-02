package com.scottlogic.hackathon.bots.move;

import com.scottlogic.hackathon.game.Direction;
import com.scottlogic.hackathon.game.Player;
import com.scottlogic.hackathon.game.Position;

import java.util.List;
import java.util.stream.Collectors;

public class HunterMove extends MoveBase {

    private int largestMapRadius;

    public HunterMove(final int mapWidth, final int mapHeight, final Player fullPlayer) {
        super(mapWidth, mapHeight, fullPlayer);
        this.largestMapRadius = (int) Math.pow(Math.max(mapWidth, mapHeight), 2);
    }

    public HunterMove(Direction direction, int distance, final int mapWidth, final int mapHeight, final Player fullPlayer) {
        super(direction, distance, mapWidth, mapHeight, fullPlayer);
        this.largestMapRadius = (int) Math.pow(Math.max(mapWidth, mapHeight), 2);
    }

    @Override
    public void phase() {
        if (opponentSpawnPoints.size() > 0) {
            List<Position> opponentSpawnPointsPositions = opponentSpawnPoints
                    .stream()
                    .map(spawnPoint -> spawnPoint.getPosition())
                    .collect(Collectors.toList());
            Position nearestOpponentSpawnPointPosition = null;
            int minDistanceSquared = largestMapRadius;
            for (Position opponentSpawnPointsPosition : opponentSpawnPointsPositions) {
                if (util.findDistanceBetweenTwoPositionsSquared(playerPosition, opponentSpawnPointsPosition) <= minDistanceSquared) {
                    nearestOpponentSpawnPointPosition = opponentSpawnPointsPosition;
                    minDistanceSquared = util.findDistanceBetweenTwoPositionsSquared(playerPosition, nearestOpponentSpawnPointPosition);
                }
            }
            if (nearestOpponentSpawnPointPosition != null) {
                distance = 0;
                direction = util.findBestDirectionFirstPositionToAnother(playerPosition, nearestOpponentSpawnPointPosition);
                while (util.playersCollideInThisMove(2, direction, playerPosition, playersPositions)) {
                    direction = util.randomDirection();
                }
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


