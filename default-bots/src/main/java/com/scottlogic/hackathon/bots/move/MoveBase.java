package com.scottlogic.hackathon.bots.move;

import java.util.ArrayList;
import java.util.Collections;
import java.util.EnumSet;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.Spliterator;
import java.util.concurrent.ThreadLocalRandom;
import java.util.stream.Collectors;
import java.util.stream.Stream;
import java.util.stream.StreamSupport;
import lombok.Getter;

import com.scottlogic.hackathon.game.*;
import com.scottlogic.hackathon.game.GameGeometry;

public class MoveBase implements Move {
  @Getter final Id player;
  final Id owner;
  Position playerPosition;

  @Getter Direction direction;
  int distance;
  Set<Position> myPlayersPositions = new HashSet<>();
  Set<Position> opponentPlayersPositions = new HashSet<>();
  Set<Position> outOfBoundsPositions = new HashSet<>();
  SpawnPoint spawnPoint;
  Set<SpawnPoint> opponentSpawnPoints = new HashSet<>();
  Set<Collectable> collectables;

  private final GameGeometry map;

  static final int MINIMUM_RANDOM_DISTANCE = 16;
  static final int MAXIMUM_RANDOM_DISTANCE = 64;
  static final int ACTIVE_RADIUS_SQUARED = 50;

  public MoveBase(GameGeometry map, final Player fullPlayer) {
    this.owner = fullPlayer.getOwner();
    this.playerPosition = fullPlayer.getPosition();
    this.player = fullPlayer.getId();
    this.map = map;
  }

  public MoveBase(Direction direction, int distance, GameGeometry map, final Player fullPlayer) {
    this(map, fullPlayer);
    this.direction = direction;
    this.distance = distance;
  }

  protected GameGeometry getMap() {
    return map;
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

  protected void setDirectionNotCollidingWithOtherPlayersIn2Moves(
      Stream<Direction> preferredDirections) {
    direction =
        preferredThenRandom(preferredDirections)
            .filter(
                d ->
                    !getMap()
                        .straightLineRoute(playerPosition, d, 2)
                        .collides(p -> !p.equals(playerPosition) && myPlayersPositions.contains(p)))
            .findFirst()
            .orElseGet(Direction::random);
  }

  public String getName() {
    return null;
  }

  public int getDistance() {
    return distance;
  }

  /**
   * Attempts to find a randomised direction and distance for a valid route.
   *
   * @param minDistance Minimum distance for route to cover
   * @param maxDistance Maximum distance for route to cover
   * @throws IllegalArgumentException if minDistance is less than 1, or maxDistance is not greater
   *     than minDistance
   */
  void setRandomDirectionAndDistance(final int minDistance, final int maxDistance)
      throws IllegalArgumentException {
    if (minDistance < 1) {
      throw new IllegalArgumentException(
          "minDistance [" + minDistance + "] must be greater than zero");
    }
    if (maxDistance <= minDistance) {
      throw new IllegalArgumentException(
          String.format(
              "maxDistance [%d] must be greater than minDistance [%d]", maxDistance, minDistance));
    }

    final List<Direction> directions = Direction.randomisedValues();

    --distance;
    if (distance < 0 || routeGoesOutOfBounds(playerPosition, direction, distance)) {
      distance = ThreadLocalRandom.current().nextInt(minDistance, maxDistance);

      while (distance >= minDistance) {
        final Optional<Direction> directionOpt =
            findDirectionForWithinBoundsRoute(playerPosition, directions, distance);
        if (directionOpt.isPresent()) {
          direction = directionOpt.get();
          break;
        }
        if (distance == minDistance) {
          // TODO Reduce MIN_DISTANCE a little, or set / calculate depending on the map?
          distance = 1;
          direction =
              findDirectionForWithinBoundsMove(playerPosition, directions).orElse(direction);
          break;
        }
        distance = ThreadLocalRandom.current().nextInt(minDistance, distance);
      }
    }
  }

  public void setMyPlayersPositions(final Set<Position> playerPositions) {
    this.myPlayersPositions = playerPositions;
    if (playerPositions != null && !playerPositions.isEmpty()) {
      opponentSpawnPoints.removeIf(
          spawnPoint ->
              playerPositions.parallelStream()
                  .anyMatch(playerPosition -> spawnPoint.getPosition().equals(playerPosition)));
    }
  }

  public void setOpponentPlayersPositions(final Set<Position> playerPositions) {
    this.opponentPlayersPositions = playerPositions;
    if (playerPositions != null && playerPositions.size() > 0 && spawnPoint != null) {
      playerPositions.parallelStream()
          .filter(opponentPlayerPosition -> opponentPlayerPosition.equals(spawnPoint.getPosition()))
          .findAny()
          .ifPresent(pos -> spawnPoint = null);
    }
  }

  public void addOutOfBoundsPositions(final Set<Position> outOfBoundsPositions) {
    this.outOfBoundsPositions.addAll(outOfBoundsPositions);
  }

  public void addSpawnPoints(final Set<SpawnPoint> spawnPoints) {
    if (spawnPoints.size() > 0) {
      if (spawnPoint == null) {
        List<SpawnPoint> spawnPointList =
            spawnPoints.stream()
                .filter(spawnPoint -> spawnPoint.getOwner() == owner)
                .collect(Collectors.toList());
        if (spawnPointList.size() > 0) {
          spawnPoint = spawnPointList.get(0);
        }
      }
      spawnPoints.stream()
          .filter(
              spawnPoint ->
                  spawnPoint.getOwner() != owner && !this.opponentSpawnPoints.contains(spawnPoint))
          .forEach(spawnPoint -> this.opponentSpawnPoints.add(spawnPoint));
    }
  }

  public void setCollectables(final Set<Collectable> collectables) {
    this.collectables = Collections.unmodifiableSet(collectables);
  }

  protected final int findDistanceBetweenTwoPositionsSquared(
      Position position1, Position position2) {
    int xDifference = map.xDistance(position1, position2);
    int yDifference = map.yDistance(position1, position2);
    return xDifference * xDifference + yDifference * yDifference;
  }

  private Stream<Direction> preferredThenRandom(Stream<Direction> preferred) {
    Set<Direction> pending = EnumSet.allOf(Direction.class);
    return Stream.concat(
        preferred.peek(pending::remove),
        StreamSupport.stream(
            () -> {
              List<Direction> remaining = new ArrayList<>(pending);
              Collections.shuffle(remaining);
              return remaining.spliterator();
            },
            Spliterator.DISTINCT | Spliterator.SIZED | Spliterator.ORDERED | Spliterator.NONNULL,
            false));
  }

  private boolean routeGoesOutOfBounds(
      final Position from, final Direction direction, final int distance) {
    return this.map.straightLineRoute(from, direction, distance).collides(outOfBoundsPositions);
  }

  private Optional<Direction> findDirectionForWithinBoundsRoute(
      final Position fromPosition, final List<Direction> directions, final int distance) {
    return directions.stream()
        .filter(direction -> !routeGoesOutOfBounds(fromPosition, direction, distance))
        .findFirst();
  }

  private Optional<Direction> findDirectionForWithinBoundsMove(
      final Position playerPosition, final List<Direction> directions) {
    return directions.stream()
        .filter(
            direction ->
                !outOfBoundsPositions.contains(map.getNeighbour(playerPosition, direction)))
        .findFirst();
  }

  public void phase() {}
}
