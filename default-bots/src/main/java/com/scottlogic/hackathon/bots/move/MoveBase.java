package com.scottlogic.hackathon.bots.move;

import com.scottlogic.hackathon.bots.Util;
import com.scottlogic.hackathon.game.*;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

public class MoveBase implements Move {
    final UUID player;
    final UUID owner;
    Position playerPosition;

    Direction direction;
    int distance;
    Set<Position> playersPositions = new HashSet<>();
    Set<Position> opponentPlayerPositions = new HashSet<>();
    Set<Position> outOfBoundsPositions = new HashSet<>();
    SpawnPoint spawnPoint;
    Set<SpawnPoint> opponentSpawnPoints = new HashSet<>();
    Set<Collectable> collectables;

    Util util;

    static final int MINIMUM_RANDOM_DISTANCE = 16;
    static final int MAXIMUM_RANDOM_DISTANCE = 64;
    static final int ACTIVE_RADIUS_SQUARED = 50;

    public MoveBase(final int mapWidth, final int mapHeight, final Player fullPlayer) {
        this.owner = fullPlayer.getOwner();
        this.playerPosition = fullPlayer.getPosition();
        this.player = fullPlayer.getId();
        this.util = new Util(mapWidth, mapHeight);
    }

    public MoveBase(Direction direction, int distance, final int mapWidth, final int mapHeight, final Player fullPlayer) {
        this.direction = direction;
        this.distance = distance;
        this.owner = fullPlayer.getOwner();
        this.playerPosition = fullPlayer.getPosition();
        this.player = fullPlayer.getId();
        this.util = new Util(mapWidth, mapHeight);
    }

    public UUID getPlayer() {
        return player;
    }

    public Direction getDirection() {
        return direction;
    }

    public String toString() {
        return String.format("Player %s - Direction %s", player, direction);
    }

    public void setPlayerPosition(Position playerPosition) {
        this.playerPosition = playerPosition;
    }

    public boolean isActive() {
        return distance == 0;
    }

    public String getName() {
        return null;
    }

    public int getDistance() {
        return distance;
    }

    void setRandomDirectionAndDistance(int minDistance, int maxDistance) {
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
                List<SpawnPoint> spawnPointList = spawnPoints.stream()
                        .filter(spawnPoint -> spawnPoint.getOwner() == owner)
                        .collect(Collectors.toList());
                if (spawnPointList.size() > 0) {
                    spawnPoint = spawnPointList.get(0);
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

    public void phase() {

    }
}
