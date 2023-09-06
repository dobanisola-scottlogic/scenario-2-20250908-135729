package com.scottlogic.hackathon.bots;

import java.util.*;
import java.util.concurrent.ThreadLocalRandom;
import java.util.stream.Collectors;

import com.scottlogic.hackathon.game.*;

public class Milestone5Bot extends Bot {
  private List<Move> lastMoves;
  private Set<Position> collectablePositions;

  public Milestone5Bot() {
    super("Milestone 5");
  }

  @Override
  public List<Move> makeMoves(final GameState gameState) {

    List<Move> moves = new ArrayList<>();
    List<Position> nextPositions = new ArrayList<>();
    collectablePositions =
        gameState.getCollectables().stream()
            .map(collectable -> collectable.getPosition())
            .collect(Collectors.toSet());

    moves.addAll(doExplore(gameState, nextPositions));
    lastMoves = moves;

    return moves;
  }

  private List<Move> doExplore(final GameState gameState, final List<Position> nextPositions) {
    List<Move> exploreMoves = new ArrayList<>();

    exploreMoves.addAll(
        gameState.getPlayers().stream()
            .filter(player -> isMyPlayer(player))
            .map(player -> doMove(gameState, nextPositions, player))
            .collect(Collectors.toList()));
    return exploreMoves;
  }

  private Move doMove(
      final GameState gameState, final List<Position> nextPositions, final Player player) {
    List<Direction> directions = new ArrayList<>(Arrays.asList(Direction.values()));

    Move collectingMove = doCollect(gameState, player, nextPositions);
    if (collectingMove != null) {
      return collectingMove;
    }

    Move lastMove =
        lastMoves == null
            ? null
            : lastMoves.stream()
                .filter(move -> player.getId().equals(move.getPlayer()))
                .findAny()
                .orElse(null);
    Direction direction = lastMove == null ? null : lastMove.getDirection();

    while (direction == null
        || (!directions.isEmpty() && !canMove(gameState, nextPositions, player, direction))) {
      direction = directions.remove(ThreadLocalRandom.current().nextInt(directions.size()));
    }
    return new MoveImpl(player.getId(), direction);
  }

  private Move doCollect(
      final GameState gameState, final Player player, final List<Position> nextPositions) {
    int distance;
    if (gameState.getPhase() < 20) {
      distance = 3;
    } else {
      distance = 14;
    }
    Position closestCollectable = null;
    for (Position collectablePosition : collectablePositions) {
      int collectableDistance =
          gameState.getMap().distance(player.getPosition(), collectablePosition);
      if (distance > collectableDistance) {
        distance = collectableDistance;
        closestCollectable = collectablePosition;
      }
    }

    if (closestCollectable != null) {
      Optional<Direction> direction =
          gameState
              .getMap()
              .directionsTowards(player.getPosition(), closestCollectable)
              .findFirst();
      if (direction.isPresent() && canMove(gameState, nextPositions, player, direction.get())) {
        return new MoveImpl(player.getId(), direction.get());
      }
    }
    return null;
  }

  private boolean canMove(
      final GameState gameState,
      final List<Position> nextPositions,
      final Player player,
      final Direction direction) {
    Set<Position> outOfBounds = gameState.getOutOfBoundsPositions();
    Position newPosition = gameState.getMap().getNeighbour(player.getPosition(), direction);
    if (!nextPositions.contains(newPosition) && !outOfBounds.contains(newPosition)) {
      nextPositions.add(newPosition);
      return true;
    } else {
      return false;
    }
  }

  private boolean isMyPlayer(final Player player) {
    return player.getOwner().equals(getId());
  }
}
