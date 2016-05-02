package com.scottlogic.hackathon.bots.move;

import com.scottlogic.hackathon.game.Collectable;
import com.scottlogic.hackathon.game.Direction;
import com.scottlogic.hackathon.game.Player;

public class CollectableMove extends MoveBase {

    public CollectableMove(final int mapWidth, final int mapHeight, final Player fullPlayer) {
        super(mapWidth, mapHeight, fullPlayer);
    }

    public CollectableMove(Direction direction, int distance, final int mapWidth, final int mapHeight, final Player fullPlayer) {
        super(direction, distance, mapWidth, mapHeight, fullPlayer);
    }

    @Override
    public void phase() {
        if (collectables.size() > 0) {
            Collectable nearestCollectable = null;
            int minDistanceSquared = ACTIVE_RADIUS_SQUARED;
            for (Collectable collectable : collectables) {
                if (util.findDistanceBetweenTwoPositionsSquared(playerPosition, collectable.getPosition()) <= minDistanceSquared) {
                    nearestCollectable = collectable;
                    minDistanceSquared = util.findDistanceBetweenTwoPositionsSquared(playerPosition, nearestCollectable.getPosition());
                }
            }
            if (nearestCollectable != null) {
                distance = 0;
                direction = util.findBestDirectionFirstPositionToAnother(playerPosition, nearestCollectable.getPosition());
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
        return "Collectable";
    }

}


