package com.scottlogic.hackathon.bots;

import com.scottlogic.hackathon.game.Direction;
import com.scottlogic.hackathon.game.Position;

import java.util.Arrays;
import java.util.HashMap;
import java.util.Random;
import java.util.Set;

public class Util {

    public Util(final int mapWidth, final int mapHeight) {
        this.mapWidth = mapWidth;
        this.mapHeight = mapHeight;
        this.xDirectionModifiers = createXDirectionModifiersMap();
        this.yDirectionModifiers = createYDirectionModifiersMap();
    }

    private final Direction[] directions = Direction.values();

    private final HashMap<Direction, Integer> xDirectionModifiers;
    private final HashMap<Direction, Integer> yDirectionModifiers;

    private final int mapWidth;
    private final int mapHeight;

    private HashMap<Direction, Integer> createXDirectionModifiersMap() {
        HashMap<Direction, Integer> xMap = new HashMap<>();
        xMap.put(directions[0], 0);
        xMap.put(directions[1], 1);
        xMap.put(directions[2], 1);
        xMap.put(directions[3], 1);
        xMap.put(directions[4], 0);
        xMap.put(directions[5], -1);
        xMap.put(directions[6], -1);
        xMap.put(directions[7], -1);
        return xMap;
    }

    private HashMap<Direction, Integer> createYDirectionModifiersMap() {
        HashMap<Direction, Integer> yMap = new HashMap<>();
        yMap.put(directions[0], -1);
        yMap.put(directions[1], -1);
        yMap.put(directions[2], 0);
        yMap.put(directions[3], 1);
        yMap.put(directions[4], 1);
        yMap.put(directions[5], 1);
        yMap.put(directions[6], 0);
        yMap.put(directions[7], -1);
        return yMap;
    }

    private int getMinimumXDifference(int x1, int x2) {
        int initialXDifference = x1 - x2;
        int modifiedXDifference = initialXDifference + mapWidth;
        return initialXDifference * initialXDifference < modifiedXDifference * modifiedXDifference ? initialXDifference : modifiedXDifference;
    }

    private int getMinimumYDifference(int y1, int y2) {
        int initialYDifference = y1 - y2;
        int modifiedYDifference = initialYDifference + mapHeight;
        return initialYDifference * initialYDifference < modifiedYDifference * modifiedYDifference ? initialYDifference : modifiedYDifference;
    }

    private int wrapX(int x) {
        int modifiedX = x;
        if (modifiedX < 0) {
            modifiedX += mapWidth;
        }
        if (modifiedX >= mapWidth) {
            modifiedX -= mapWidth;
        }
        return modifiedX;
    }

    private int wrapY(int y) {
        int modifiedY = y;
        if (modifiedY < 0) {
            modifiedY += mapHeight;
        }
        if (modifiedY >= mapHeight) {
            modifiedY -= mapHeight;
        }
        return modifiedY;
    }

    public Direction findBestDirectionFirstPositionToAnother(Position myPosition, Position desiredPosition) {
        int xDifference = getMinimumXDifference(desiredPosition.getX(), myPosition.getX());
        int yDifference = getMinimumYDifference(desiredPosition.getY(), myPosition.getY());
        // returns radian angle between -pi and +pi
        // y decrements as we go north REMEMBER
        double theta = Math.atan2((double) -yDifference, (double) xDifference);
        // HARD CODED Method BASED ON THE 8 DIRECTION VALUES (
        int modifiedTheta = (int) Math.round(2 - 4 * theta / Math.PI);
        if (modifiedTheta < 0) {
            modifiedTheta += directions.length;
        }
        return directions[modifiedTheta];
    }

    public Direction findBestDirectionFirstPositionFromAnother(Position myPosition, Position avoidedPosition) {
        int xDifference = getMinimumXDifference(avoidedPosition.getX(), myPosition.getX());
        int yDifference = getMinimumYDifference(avoidedPosition.getY(), myPosition.getY());
        // returns radian angle between -pi and +pi
        // y decrements as we go north REMEMBER
        double theta = Math.atan2((double) -yDifference, (double) xDifference);
        // HARD CODED Method BASED ON THE 8 DIRECTION VALUES (
        int modifiedTheta = (int) Math.round(6 - 4 * theta / Math.PI);
        if (modifiedTheta >= directions.length) {
            modifiedTheta -= directions.length;
        }
        return directions[modifiedTheta];
    }

    public Direction findBestTetherDirectionOnePositionToAnother(Position myPosition, Position desiredTether, int distance) {
        int minDistanceToTether = distance * distance;
        int index = new Random().nextInt(directions.length);
        int randomModifier = new Random().nextInt(directions.length);
        for (int i = randomModifier; i < directions.length + randomModifier; i++) {
            Position projectedPosition = new Position(wrapX(myPosition.getX() + xDirectionModifiers.get(directions[i % directions.length])),
                    wrapY(myPosition.getY() + yDirectionModifiers.get(directions[i % directions.length])));
            if (Math.abs(findDistanceBetweenTwoPositionsSquared(projectedPosition, desiredTether) - distance * distance) < minDistanceToTether) {
                index = i % directions.length;
                minDistanceToTether = Math.abs(findDistanceBetweenTwoPositionsSquared(projectedPosition, desiredTether) - distance * distance);
            }
        }
        return directions[index];
    }

    public int findDistanceBetweenTwoPositionsSquared(Position position1, Position position2) {
        int xDifference = getMinimumXDifference(position1.getX(), position2.getX());
        int yDifference = getMinimumYDifference(position1.getY(), position2.getY());
        return xDifference * xDifference + yDifference * yDifference;
    }

    public int randomDistance(int minDistance, int maxDistance) {
        return new Random().nextInt(maxDistance - minDistance) + minDistance;
    }

    public Direction getOppositeDirection(Direction direction) {
        int directionIndex = Arrays.asList(directions).indexOf(direction);
        directionIndex += directions.length / 2;
        if (directionIndex >= directions.length) {
            directionIndex -= directions.length;
        }
        return directions[directionIndex];
    }

    public Direction randomDirection() {
        return directions[new Random().nextInt(directions.length)];
    }

    public boolean playersCollideInThisMove(int distance, Direction direction, Position playerPosition, Set<Position> myPlayersPositions) {
        final int directionIndex = direction.ordinal();
        boolean playersCollide = myPlayersPositions.stream()
                .filter(myPlayersPosition -> playerPosition.getX() != myPlayersPosition.getX() || playerPosition.getY() != myPlayersPosition.getY())
                .anyMatch(myPlayersPosition -> {
                    boolean playerCollides = false;
                    int newXPosition = wrapX(playerPosition.getX());
                    int xDirectionModifier = xDirectionModifiers.get(directions[directionIndex]);
                    int newYPosition = wrapY(playerPosition.getY());
                    int yDirectionModifier = yDirectionModifiers.get(directions[directionIndex]);
                    for (int i = 1; i <= distance; i++) {
                        newXPosition += xDirectionModifier;
                        newXPosition = wrapX(newXPosition);
                        newYPosition += yDirectionModifier;
                        newYPosition = wrapY(newYPosition);
                        playerCollides = (newXPosition == myPlayersPosition.getX() && newYPosition == myPlayersPosition.getY());
                    }
                    return playerCollides;
                });
        return playersCollide;
    }

    public boolean moveGoesOutOfBounds(int distance, Direction direction, Position playerPosition, Set<Position> outOfBoundsPositions) {
        final int directionIndex = direction.ordinal();
        boolean intersectsOutOfBoundsPositions = outOfBoundsPositions.stream()
                .filter(outOfBoundsPosition -> playerPosition.getX() != outOfBoundsPosition.getX() || playerPosition.getY() != outOfBoundsPosition.getY())
                .anyMatch(outOfBoundsPosition -> {
                    boolean intersectOutOfBoundsPositions = false;
                    int newXPosition = wrapX(playerPosition.getX());
                    int xDirectionModifier = xDirectionModifiers.get(directions[directionIndex]);
                    int newYPosition = wrapY(playerPosition.getY());
                    int yDirectionModifier = yDirectionModifiers.get(directions[directionIndex]);
                    for (int i = 1; i <= distance; i++) {
                        newXPosition += xDirectionModifier;
                        newXPosition = wrapX(newXPosition);
                        newYPosition += yDirectionModifier;
                        newYPosition = wrapY(newYPosition);
                        if (newXPosition == outOfBoundsPosition.getX() && newYPosition == outOfBoundsPosition.getY()) {
                            intersectOutOfBoundsPositions = true;
                        }
                    }
                    return intersectOutOfBoundsPositions;
                });
        return intersectsOutOfBoundsPositions;

    }
}
