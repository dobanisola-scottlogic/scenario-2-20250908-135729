package com.scottlogic.hackathon.game.engine;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.scottlogic.hackathon.game.GameGeometry;
import com.scottlogic.hackathon.game.Player;
import com.scottlogic.hackathon.game.TrackedSet;

public class BattleSystem {
  private final int battleRadius;
  private final TrackedSet<Player> players;
  private final GameGeometry map;
  private final Logger logger;

  BattleSystem(final TrackedSet<Player> players, final GameGeometry map, final int battleRadius) {
    this.players = players;
    this.map = map;
    this.battleRadius = battleRadius;
    logger = LoggerFactory.getLogger(this.getClass().getName());
  }

  public Set<Player> runBattle() {
    return players.stream().filter(player -> outnumbered(player)).collect(Collectors.toSet());
  }

  private boolean outnumbered(final Player player) {
    final List<Player> enemiesInRangeOfPlayer = enemiesInRange(player);
    boolean result =
        enemiesInRangeOfPlayer.stream()
            .anyMatch(enemy -> enemiesInRangeOfPlayer.size() >= enemiesInRange(enemy).size());
    if (result) {
      logger.debug(
          "Battle Occurred. Player Outnumbered: " + player + " by: " + enemiesInRangeOfPlayer);
    }
    return result;
  }

  private List<Player> enemiesInRange(final Player of) {
    return players.stream()
        .filter(player -> !player.getOwner().equals(of.getOwner()))
        .filter(enemy -> map.distance(enemy.getPosition(), of.getPosition()) <= battleRadius)
        .collect(Collectors.toList());
  }
}
