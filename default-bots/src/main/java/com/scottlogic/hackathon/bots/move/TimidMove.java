package com.scottlogic.hackathon.bots.move;

import com.scottlogic.hackathon.game.Direction;
import com.scottlogic.hackathon.game.Map;
import com.scottlogic.hackathon.game.Player;
import com.scottlogic.hackathon.game.Position;

public class TimidMove extends MoveBase {

    public TimidMove(Map map, final Player fullPlayer) {
        super(map, fullPlayer);
    }

    public TimidMove(Direction direction, int distance, Map map, final Player fullPlayer) {
        super(direction, distance, map, fullPlayer);
    }

    @Override
    public void phase() {
        if (opponentPlayerPositions.size() > 0) {
            Position nearestOpponentPosition = null;
            int minDistanceSquared = ACTIVE_RADIUS_SQUARED;
            for (Position opponentPosition : opponentPlayerPositions) {
                if (findDistanceBetweenTwoPositionsSquared(playerPosition, opponentPosition) <= minDistanceSquared) {
                    nearestOpponentPosition = opponentPosition;
                    minDistanceSquared = findDistanceBetweenTwoPositionsSquared(playerPosition, opponentPosition);
                }
            }
            if (nearestOpponentPosition != null) {
                distance = 0;
                setDirectionNotCollidingWithOtherPlayersIn2Moves(getMap().directionsAwayFrom(playerPosition, nearestOpponentPosition));
            } else {
                setRandomDirectionAndDistance(MINIMUM_RANDOM_DISTANCE, MAXIMUM_RANDOM_DISTANCE);
            }
        } else {
            setRandomDirectionAndDistance(MINIMUM_RANDOM_DISTANCE, MAXIMUM_RANDOM_DISTANCE);
        }
    }

    @Override
    public String getName() {
        return "Timid";
    }

}
