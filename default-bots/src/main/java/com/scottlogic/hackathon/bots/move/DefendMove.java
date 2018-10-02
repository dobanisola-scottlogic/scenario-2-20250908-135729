package com.scottlogic.hackathon.bots.move;

import com.scottlogic.hackathon.game.Direction;
import com.scottlogic.hackathon.game.Map;
import com.scottlogic.hackathon.game.Player;

import java.util.Random;

public class DefendMove extends MoveBase {

    private int tetherDistance;

    private static final int MINIMUM_SPAWN_POINT_TETHER = 3;
    private static final int MAXIMUM_SPAWN_POINT_TETHER = 6;
    private static final int RANDOM_MOVEMENT_PERCENTAGE = 25;

    public DefendMove(Map map, final Player fullPlayer) {
        super(map, fullPlayer);
        // Tether distance is how far it aims to stay to the spawn point
        this.tetherDistance = new Random().nextInt(MINIMUM_SPAWN_POINT_TETHER) + MAXIMUM_SPAWN_POINT_TETHER - MINIMUM_SPAWN_POINT_TETHER;
    }

    public DefendMove(Direction direction, int distance, Map map, final Player fullPlayer) {
        super(direction, distance, map, fullPlayer);
        // Tether distance is how far it aims to stay to the spawn point
        this.tetherDistance = new Random().nextInt(MINIMUM_SPAWN_POINT_TETHER) + MAXIMUM_SPAWN_POINT_TETHER - MINIMUM_SPAWN_POINT_TETHER;
    }

    @Override
    public void phase() {
        if (spawnPoint != null) {
            distance = 0;
            // Random Percentage keeps the defend move from getting stuck in a local oscillation
            if (util.findDistanceBetweenTwoPositionsSquared(playerPosition, spawnPoint.getPosition()) == 0 ||
                    new Random().nextInt(100) < RANDOM_MOVEMENT_PERCENTAGE) {
                direction = util.randomDirection();
            } else {
                direction = util.findBestTetherDirectionOnePositionToAnother(playerPosition, spawnPoint.getPosition(), tetherDistance);
            }
            while (util.playersCollideInThisMove(2, direction, playerPosition, playersPositions)) {
                direction = util.randomDirection();
            }
        } else {
            setRandomDirectionAndDistance(MINIMUM_SPAWN_POINT_TETHER, MAXIMUM_SPAWN_POINT_TETHER);
        }
    }

    @Override
    public String getName() {
        return "Defend";
    }

}


