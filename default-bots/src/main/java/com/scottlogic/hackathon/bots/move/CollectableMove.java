package com.scottlogic.hackathon.bots.move;

import com.scottlogic.hackathon.game.Collectable;
import com.scottlogic.hackathon.game.Direction;
import com.scottlogic.hackathon.game.Map;
import com.scottlogic.hackathon.game.Player;

import java.util.stream.Stream;

public class CollectableMove extends MoveBase {

    public CollectableMove(Map map, final Player fullPlayer) {
        super(map, fullPlayer);
    }

    public CollectableMove(Direction direction, int distance, Map map, final Player fullPlayer) {
        super(direction, distance, map, fullPlayer);
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
                direction = Stream.concat(getMap().directionsTowards(playerPosition, nearestCollectable.getPosition()), util.randomDirections())
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
        return "Collectable";
    }

}


