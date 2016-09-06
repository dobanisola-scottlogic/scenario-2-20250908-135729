package com.scottlogic.hackathon.bots;

import com.scottlogic.hackathon.bots.move.TimidMove;
import com.scottlogic.hackathon.game.*;

import java.util.*;
import java.util.stream.Collectors;

public class Milestone1Bot extends Bot {
    private final List<TimidMove> moves = new LinkedList<>();

    @Override
    public List<Move> makeMoves(final GameState gameState) {
        gameState.getRemovedPlayers().forEach(player -> {
            moves.removeIf(move -> move.getPlayer().equals(player.getId()));
        });

        final int mapWidth = gameState.getMap().getWidth();
        final int mapHeight = gameState.getMap().getHeight();

        final Set<UUID> previousPlayers = moves
                .stream()
                .map(move -> move.getPlayer())
                .collect(Collectors.toSet());

        final Set<Position> playerPositions = new HashSet<>();
        final Set<Position> opponentPlayerPositions = new HashSet<>();
        gameState.getPlayers().forEach(player -> {
            if (player.getOwner().equals(getId())) {
                playerPositions.add(player.getPosition());
                if (!previousPlayers.contains(player.getId())) {
                    moves.add(new TimidMove(mapWidth, mapHeight, player));
                } else {
                    moves.forEach(move -> {
                        if (move.getPlayer().equals(player.getId())) {
                            move.setPlayerPosition(player.getPosition());
                        }
                    });
                }
            } else {
                opponentPlayerPositions.add(player.getPosition());
            }
        });

        final Set<Position> outOfBoundsPositions = gameState.getOutOfBoundsPositions().stream().collect(Collectors.toSet());
        final Set<SpawnPoint> spawnPoints = gameState.getSpawnPoints().stream().collect(Collectors.toSet());
        final Set<Collectable> collectables = gameState.getCollectables().stream().collect(Collectors.toSet());
        moves.forEach(move -> {
            move.setPlayersPositions(playerPositions);
            move.setOpponentPlayerPositions(opponentPlayerPositions);
            move.addOutOfBoundsPositions(outOfBoundsPositions);
            move.addSpawnPoints(spawnPoints);
            move.setCollectables(collectables);
            move.phase();
        });

        return Collections.unmodifiableList(moves);
    }

    @Override
    public String getDisplayName() {
        return "Milestone 1 Bot";
    }
}
