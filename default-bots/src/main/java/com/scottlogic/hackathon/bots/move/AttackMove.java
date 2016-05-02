package com.scottlogic.hackathon.bots.move;

import com.scottlogic.hackathon.game.Direction;
import com.scottlogic.hackathon.game.Player;
import com.scottlogic.hackathon.game.Position;

public class AttackMove extends MoveBase {

    public AttackMove(final int mapWidth, final int mapHeight, final Player fullPlayer) {
        super(mapWidth, mapHeight, fullPlayer);
    }

    public AttackMove(Direction direction, int distance, final int mapWidth, final int mapHeight, final Player fullPlayer) {
        super(direction, distance, mapWidth, mapHeight, fullPlayer);
    }

    @Override
    public void phase() {
        if (opponentPlayerPositions.size() > 0) {
            Position nearestOpponentPosition = null;
            int minDistanceSquared = ACTIVE_RADIUS_SQUARED;
            for (Position opponentPosition : opponentPlayerPositions) {
                if (util.findDistanceBetweenTwoPositionsSquared(playerPosition, opponentPosition) <= minDistanceSquared) {
                    nearestOpponentPosition = opponentPosition;
                    minDistanceSquared = util.findDistanceBetweenTwoPositionsSquared(playerPosition, opponentPosition);
                }
            }
            if (nearestOpponentPosition != null) {
                distance = 0;
                direction = util.findBestDirectionFirstPositionToAnother(playerPosition, nearestOpponentPosition);
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
        return "Attack";
    }

}

