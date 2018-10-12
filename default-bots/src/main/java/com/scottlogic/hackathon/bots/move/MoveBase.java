package com.scottlogic.hackathon.bots.move;

import com.scottlogic.hackathon.game.Collectable;
import com.scottlogic.hackathon.game.Direction;
import com.scottlogic.hackathon.game.Map;
import com.scottlogic.hackathon.game.Move;
import com.scottlogic.hackathon.game.Player;
import com.scottlogic.hackathon.game.Position;
import com.scottlogic.hackathon.game.SpawnPoint;

import java.util.ArrayList;
import java.util.Collections;
import java.util.EnumSet;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.Spliterator;
import java.util.UUID;
import java.util.concurrent.ThreadLocalRandom;
import java.util.stream.Collectors;
import java.util.stream.Stream;
import java.util.stream.StreamSupport;

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

    private final Map map;

    static final int MINIMUM_RANDOM_DISTANCE = 16;
    static final int MAXIMUM_RANDOM_DISTANCE = 64;
    static final int ACTIVE_RADIUS_SQUARED = 50;

    public MoveBase(Map map, final Player fullPlayer) {
        this.owner = fullPlayer.getOwner();
        this.playerPosition = fullPlayer.getPosition();
        this.player = fullPlayer.getId();
        this.map = map;
    }

    public MoveBase(Direction direction, int distance, Map map, final Player fullPlayer) {
        this(map, fullPlayer);
        this.direction = direction;
        this.distance = distance;
    }

    protected Map getMap() {
        return map;
    }

    @Override
    public UUID getPlayer() {
        return player;
    }

    @Override
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

    protected void setDirectionNotCollidingWithOtherPlayersIn2Moves(Stream<Direction> preferredDirections) {
        direction = preferredThenRandom(preferredDirections)
                .filter(d -> !getMap().straightLineRoute(playerPosition, d, 2).collides(playersPositions))
                .findFirst()
                .orElseGet(Direction::random);
    }

    public String getName() {
        return null;
    }

    public int getDistance() {
        return distance;
    }

    void setRandomDirectionAndDistance(int minDistance, int maxDistance) {
        --distance;
        while (distance < 0 || map.straightLineRoute(playerPosition, direction, distance).collides(outOfBoundsPositions)) {
            distance = ThreadLocalRandom.current().nextInt(maxDistance - minDistance) + minDistance;
            direction = Direction.random();
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

    protected final int findDistanceBetweenTwoPositionsSquared(Position position1, Position position2) {
        int xDifference = map.xDistance(position1, position2);
        int yDifference = map.yDistance(position1, position2);
        return xDifference * xDifference + yDifference * yDifference;
    }

    private Stream<Direction> preferredThenRandom(Stream<Direction> preferred) {
        Set<Direction> pending = EnumSet.allOf(Direction.class);
        return Stream.concat(preferred.peek(pending::remove), StreamSupport.stream(() -> {
                    List<Direction> remaining = new ArrayList<>(pending);
                    Collections.shuffle(remaining);
                    return remaining.spliterator();
                }, Spliterator.DISTINCT | Spliterator.SIZED | Spliterator.ORDERED | Spliterator.NONNULL,
                false));
    }

    public void phase() {

    }
}
