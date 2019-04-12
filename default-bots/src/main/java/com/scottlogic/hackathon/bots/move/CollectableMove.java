package com.scottlogic.hackathon.bots.move;

import com.scottlogic.hackathon.game.Collectable;
import com.scottlogic.hackathon.game.Direction;
import com.scottlogic.hackathon.game.GameGeometry;
import com.scottlogic.hackathon.game.Player;

public class CollectableMove extends MoveBase {

    public CollectableMove(GameGeometry map, final Player fullPlayer) {
        super(map, fullPlayer);
    }

    public CollectableMove(Direction direction, int distance, GameGeometry map, final Player fullPlayer) {
        super(direction, distance, map, fullPlayer);
    }

    @Override
    public void phase() {
        if (collectables.size() > 0) {
            Collectable nearestCollectable = null;
            int minDistanceSquared = ACTIVE_RADIUS_SQUARED;
            for (Collectable collectable : collectables) {
                if (findDistanceBetweenTwoPositionsSquared(playerPosition, collectable.getPosition()) <= minDistanceSquared) {
                    nearestCollectable = collectable;
                    minDistanceSquared = findDistanceBetweenTwoPositionsSquared(playerPosition, nearestCollectable.getPosition());
                }
            }
            if (nearestCollectable != null) {
                distance = 0;
                setDirectionNotCollidingWithOtherPlayersIn2Moves(getMap().directionsTowards(playerPosition, nearestCollectable.getPosition()));
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


