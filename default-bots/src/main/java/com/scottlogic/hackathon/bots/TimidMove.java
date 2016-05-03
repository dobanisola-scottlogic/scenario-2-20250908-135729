package com.scottlogic.hackathon.bots;

import com.scottlogic.hackathon.game.*;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

public class TimidMove implements Move {
    private final UUID player;
    private final UUID owner;
    private Position playerPosition;

    private Direction direction;
    private int distance;

    private Set<Position> playersPositions = new HashSet<>();

    private Set<Position> opponentPlayerPositions = new HashSet<>();

    private Set<Position> outOfBoundsPositions = new HashSet<>();

    private SpawnPoint spawnPoint;
    private Set<SpawnPoint> opponentSpawnPoints = new HashSet<>();

    private Set<Collectable> collectables;

    private Util util;

    private static final int MINIMUM_RANDOM_DISTANCE = 16;
    private static final int MAXIMUM_RANDOM_DISTANCE = 64;
    private static final int ACTIVE_RADIUS_SQUARED = 50;

    public TimidMove(final int mapWidth, final int mapHeight, final Player fullPlayer) {
        this.owner = fullPlayer.getOwner();
        this.playerPosition = fullPlayer.getPosition();
        this.player = fullPlayer.getId();
        this.util = new Util(mapWidth, mapHeight);
    }

    public void setPlayerPosition(Position playerPosition) {
        this.playerPosition = playerPosition;
    }

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
                direction = util.findBestDirectionFirstPositionFromAnother(playerPosition, nearestOpponentPosition);
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

    private void setRandomDirectionAndDistance(int minDistance, int maxDistance) {
        if (distance <= 0 || util.moveGoesOutOfBounds(distance, direction, playerPosition, outOfBoundsPositions)) {
            boolean isValidMove = false;
            while (!isValidMove) {
                distance = util.randomDistance(minDistance, maxDistance);
                direction = util.randomDirection();
                isValidMove = !util.moveGoesOutOfBounds(distance, direction, playerPosition, outOfBoundsPositions);
            }
        } else {
            distance--;
        }
    }

    @Override
    public UUID getPlayer() {
        return player;
    }

    @Override
    public Direction getDirection() {
        return direction;
    }

    @Override
    public String toString() {
        return String.format("Player %s - Direction %s", player, direction);
    }

    public void setPlayersPositions(Set<Position> playersPositions) {
        this.playersPositions = playersPositions;
        if (playersPositions != null && playersPositions.size() > 0 && opponentSpawnPoints.size() > 0) {
            for (Position myPlayerPosition : playersPositions) {
                Set<SpawnPoint> opponentSpawnPointsReached = opponentSpawnPoints.stream()
                        .filter(opponentSpawnPoint -> myPlayerPosition.getX() == opponentSpawnPoint.getPosition().getX() &&
                                myPlayerPosition.getY() == opponentSpawnPoint.getPosition().getY())
                        .collect(Collectors.toSet());
                for (SpawnPoint opponentSpawnPointReached : opponentSpawnPointsReached) {
                    this.opponentSpawnPoints.remove(opponentSpawnPointReached);
                }
            }
        }
    }

    public void setOpponentPlayerPositions(Set<Position> opponentPlayerPositions) {
        this.opponentPlayerPositions = opponentPlayerPositions;
        if (opponentPlayerPositions != null && opponentPlayerPositions.size() > 0 && spawnPoint != null) {
            opponentPlayerPositions.stream()
                    .filter(opponentPlayerPosition -> spawnPoint != null &&
                            opponentPlayerPosition.getX() == spawnPoint.getPosition().getX() &&
                            opponentPlayerPosition.getY() == spawnPoint.getPosition().getY())
                    .forEach(opponentPlayerPosition -> {
                        spawnPoint = null;
                    });
        }
    }

    public void addOutOfBoundsPositions(Set<Position> outOfBoundsPositions) {
        outOfBoundsPositions.stream()
                .filter(outOfBoundsPosition -> !this.outOfBoundsPositions.contains(outOfBoundsPosition))
                .forEach(outOfBoundsPosition -> {
                    this.outOfBoundsPositions.add(outOfBoundsPosition);
                });
        this.outOfBoundsPositions = outOfBoundsPositions;
    }

    public void addSpawnPoints(Set<SpawnPoint> spawnPoints) {
        if (spawnPoints.size() > 0) {
            if (spawnPoint == null) {
                List<SpawnPoint> mySpawnPointList = spawnPoints.stream()
                        .filter(spawnPoint -> spawnPoint.getOwner() == owner)
                        .collect(Collectors.toList());
                if (mySpawnPointList.size() > 0) {
                    spawnPoint = mySpawnPointList.get(0);
                }
            }
            spawnPoints.stream()
                    .filter(spawnPoint -> spawnPoint.getOwner() != owner && !this.opponentSpawnPoints.contains(spawnPoint))
                    .forEach(spawnPoint -> {
                        this.opponentSpawnPoints.add(spawnPoint);
                    });
        }
    }

    public void setCollectables(Set<Collectable> collectables) {
        this.collectables = collectables;
    }
}
