package com.scottlogic.hackathon.bots.move;

import com.scottlogic.hackathon.game.Direction;
import com.scottlogic.hackathon.game.GameMap;
import com.scottlogic.hackathon.game.Player;
import com.scottlogic.hackathon.game.Position;

import java.util.concurrent.ThreadLocalRandom;

public class DefendMove extends MoveBase {

    private static final Direction[] DIRECTIONS = Direction.values();

    private final int tetherDistance;

    private static final int MINIMUM_SPAWN_POINT_TETHER = 3;
    private static final int MAXIMUM_SPAWN_POINT_TETHER = 6;
    private static final int RANDOM_MOVEMENT_PERCENTAGE = 25;

    public DefendMove(GameMap map, final Player fullPlayer) {
        super(map, fullPlayer);
        this.tetherDistance = randomTetherDistance();
    }

    public DefendMove(Direction direction, int distance, GameMap map, final Player fullPlayer) {
        super(direction, distance, map, fullPlayer);
        this.tetherDistance = randomTetherDistance();
    }

    private static int randomTetherDistance() {
        // Tether distance is how far it aims to stay to the spawn point
        return ThreadLocalRandom.current().nextInt(MINIMUM_SPAWN_POINT_TETHER) + MAXIMUM_SPAWN_POINT_TETHER - MINIMUM_SPAWN_POINT_TETHER;
    }

    @Override
    public void phase() {
        if (spawnPoint != null) {
            distance = 0;
            // Random Percentage keeps the defend move from getting stuck in a local oscillation
            if (playerPosition.equals(spawnPoint.getPosition())
                    || ThreadLocalRandom.current().nextInt(100) < RANDOM_MOVEMENT_PERCENTAGE) {
                direction = Direction.random();
            } else {
                direction = findBestTetherDirectionOnePositionToAnother(playerPosition, spawnPoint.getPosition(), tetherDistance);
            }
            while (getMap().straightLineRoute(playerPosition, direction, 2).collides(myPlayersPositions)) {
                direction = Direction.random();
            }
        } else {
            setRandomDirectionAndDistance(MINIMUM_SPAWN_POINT_TETHER, MAXIMUM_SPAWN_POINT_TETHER);
        }
    }

    private Direction findBestTetherDirectionOnePositionToAnother(Position myPosition, Position desiredTether, final int distance) {
        int minDistanceToTether = distance * distance;
        int index = ThreadLocalRandom.current().nextInt(Direction.values().length);
        int randomModifier = ThreadLocalRandom.current().nextInt(DIRECTIONS.length);
        for (int i = randomModifier; i < DIRECTIONS.length + randomModifier; i++) {
            Position projectedPosition = getMap().getNeighbour(myPosition, DIRECTIONS[i% DIRECTIONS.length]);
            int distanceToTether = Math.abs(findDistanceBetweenTwoPositionsSquared(projectedPosition, desiredTether) - distance * distance);
            if (distanceToTether < minDistanceToTether) {
                index = i % DIRECTIONS.length;
                minDistanceToTether = distanceToTether;
            }
        }
        return DIRECTIONS[index];
    }

    @Override
    public String getName() {
        return "Defend";
    }

}


