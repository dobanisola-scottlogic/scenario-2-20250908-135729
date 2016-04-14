package com.scottlogic.hackathon.game.engine;

import com.scottlogic.hackathon.game.engine.maps.PlayableMap;
import com.scottlogic.hackathon.game.engine.models.PlayerImpl;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

public class BattleSystem {
    private final int battleRadius;
    private final TrackedSet<PlayerImpl> players;
    private final PlayableMap map;

    BattleSystem(final TrackedSet<PlayerImpl> players, final PlayableMap map, final int battleRadius) {
        this.players = players;
        this.map = map;
        this.battleRadius = battleRadius;
    }

    public Set<PlayerImpl> runBattle() {
        return players
                .stream()
                .filter(player -> outnumbered(player))
                .collect(Collectors.toSet());
    }

    private boolean outnumbered(final PlayerImpl player) {
        final List<PlayerImpl> enemiesInRangeOfPlayer = enemiesInRange(player);
        return enemiesInRangeOfPlayer
                .stream()
                .anyMatch(enemy -> enemiesInRangeOfPlayer.size() >= enemiesInRange(enemy).size());
    }

    private List<PlayerImpl> enemiesInRange(final PlayerImpl of) {
        return players.stream()
                .filter(player -> !player.getOwner().equals(of.getOwner()))
                .filter(enemy -> map.distanceBetween(enemy.getPosition(), of.getPosition()) <= battleRadius)
                .collect(Collectors.toList());
    }
}
