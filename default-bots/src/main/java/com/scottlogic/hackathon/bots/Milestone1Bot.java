package com.scottlogic.hackathon.bots;

import com.scottlogic.hackathon.game.*;

import java.util.*;
import java.util.stream.Collectors;

public class Milestone1Bot implements Bot {
    private final List<TimidMove> moves = new LinkedList<>();
    private UUID id;

    @Override
    public List<Move> makeMoves(final GameState gameState) {
        gameState.getRemovedPlayers().forEach(player -> {
            moves.removeIf(move -> move.getPlayer().equals(player.getId()));
        });

        int mapWidth = gameState.getMap().getWidth();
        int mapHeight = gameState.getMap().getHeight();

        final Set<UUID> previousPlayers = moves
                .stream()
                .map(move -> move.getPlayer())
                .collect(Collectors.toSet());

        Set<Position> playerPositions = new HashSet<>();
        Set<Position> opponentPlayerPositions = new HashSet<>();
        gameState.getPlayers().forEach(player -> {
            if (player.getOwner().equals(id)) {
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

        Set<Position> outOfBoundsPositions = gameState.getOutOfBoundsPositions().stream().collect(Collectors.toSet());
        Set<SpawnPoint> spawnPoints = gameState.getSpawnPoints().stream().collect(Collectors.toSet());
        Set<Collectable> collectables = gameState.getCollectables().stream().collect(Collectors.toSet());
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
    public UUID getId() {
        return id;
    }

    @Override
    public void setId(final UUID id) {
        this.id = id;
    }
}
