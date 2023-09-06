package com.scottlogic.hackathon.bots;

import java.util.*;

import com.scottlogic.hackathon.game.*;

public class Milestone1Bot extends Bot {
  private HashMap<Id, Direction> playerDirectionHashMap;

  public Milestone1Bot() {
    super("Milestone 1");
  }

  @Override
  public void initialise(GameState gameState) {
    playerDirectionHashMap = new HashMap<>();
  }

  @Override
  public List<Move> makeMoves(GameState gameState) {
    removeDeadPlayers(gameState);
    moveStraight(gameState);
    List<Move> moves = extractMoves(gameState);
    return moves;
  }

  private void moveStraight(GameState gameState) {
    for (Player player : gameState.getPlayers()) {
      Id playerID = player.getId();
      if (playerDirectionHashMap.containsKey(playerID) && isMyPlayer(player)) {
        // Do nothing, player already exists in the HashMap
      } else {
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
