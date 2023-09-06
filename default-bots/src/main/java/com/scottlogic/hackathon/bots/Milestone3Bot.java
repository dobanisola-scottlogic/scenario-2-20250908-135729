package com.scottlogic.hackathon.bots;

import java.util.*;

import com.scottlogic.hackathon.game.*;

public class Milestone3Bot extends Bot {
  private HashMap<Id, Direction> playerDirectionHashMap;
  private List<Position> nextPositions;

  public Milestone3Bot() {
    super("Milestone 1");
  }

  @Override
  public void initialise(GameState gameState) {
    playerDirectionHashMap = new HashMap<>();
  }

  @Override
  public List<Move> makeMoves(GameState gameState) {
    nextPositions = new ArrayList<>();
    removeDeadPlayers(gameState);
    moveRandom(gameState);
    List<Move> moves = extractMoves(gameState);
    return moves;
  }

  private void moveRandom(GameState gameState) {
    for (Player player : gameState.getPlayers()) {
      Id playerID = player.getId();
      if (isMyPlayer(player)) {
        playerDirectionHashMap.put(playerID, Direction.random());
      }
    }
  }

  private List<Move> extractMoves(GameState gameState) {
    List<Move> moves = new ArrayList<>();
    for (Map.Entry<Id, Direction> item : playerDirectionHashMap.entrySet()) {
      Id playerID = item.getKey();
      Direction direction = item.getValue();
      Player player = findPlayerByID(gameState, playerID);
      if (player != null && canMove(gameState, player, direction)) {
        moves.add(new MoveImpl(playerID, direction));
        Position newPosition = gameState.getMap().getNeighbour(player.getPosition(), direction);
        nextPositions.add(newPosition);
      } else {
        // Player cannot move
      }
    }
    return moves;
  }

  private void removeDeadPlayers(GameState gameState) {
    for (Player player : gameState.getRemovedPlayers()) {
      playerDirectionHashMap.remove(player.getId());
    }
  }

  private boolean canMove(
      final GameState gameState, final Player player, final Direction direction) {
    Set<Position> outOfBounds = gameState.getOutOfBoundsPositions();
    Position newPosition = gameState.getMap().getNeighbour(player.getPosition(), direction);
    if (!nextPositions.contains(newPosition) && !outOfBounds.contains(newPosition)) {
      return true;
    } else {
      return false;
    }
  }

  private Player findPlayerByID(GameState gameState, Id id) {
    for (Player player : gameState.getPlayers()) {
      if (player.getId().equals(id)) {
        return player;
      }
    }
    return null;
  }

  private boolean isMyPlayer(Player player) {
    return player.getOwner().equals(getId());
  }
}
