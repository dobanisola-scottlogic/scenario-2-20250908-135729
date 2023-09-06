package com.scottlogic.hackathon.bots;

import java.util.*;

import com.scottlogic.hackathon.game.*;

public class Milestone2Bot extends Bot {
  private HashMap<Id, Direction> playerDirectionHashMap;

  public Milestone2Bot() {
    super("Milestone 2");
  }

  @Override
  public void initialise(GameState gameState) {
    playerDirectionHashMap = new HashMap<>();
  }

  @Override
  public List<Move> makeMoves(GameState gameState) {
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
      moves.add(new MoveImpl(playerID, direction));
    }
    return moves;
  }

  private void removeDeadPlayers(GameState gameState) {
    for (Player player : gameState.getRemovedPlayers()) {
      playerDirectionHashMap.remove(player.getId());
    }
  }

  private boolean isMyPlayer(Player player) {
    return player.getOwner().equals(getId());
  }
}
