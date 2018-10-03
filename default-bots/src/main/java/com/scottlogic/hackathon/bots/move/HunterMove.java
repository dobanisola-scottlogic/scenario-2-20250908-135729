package com.scottlogic.hackathon.bots.move;

import com.scottlogic.hackathon.game.Direction;
import com.scottlogic.hackathon.game.Map;
import com.scottlogic.hackathon.game.Player;
import com.scottlogic.hackathon.game.Position;

import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.Stream;

public class HunterMove extends MoveBase {

    private int largestMapRadius;

    public HunterMove(Map map, final Player fullPlayer) {
        super(map, fullPlayer);
        this.largestMapRadius = determineLargestMapRadius(map);
    }

    public HunterMove(Direction direction, int distance, Map map, final Player fullPlayer) {
        super(direction, distance, map, fullPlayer);
        this.largestMapRadius = determineLargestMapRadius(map);
    }

    private static int determineLargestMapRadius(Map map) {
        return (int) Math.pow(Math.max(map.getWidth(), map.getHeight()), 2);
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
                direction = Stream.concat(getMap().directionsTowards(playerPosition, nearestOpponentSpawnPointPosition), util.randomDirections())
                        .filter(d -> util.playersCollideInThisMove(2, d, playerPosition, playersPositions))
                        .findFirst()
                        .get();
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


