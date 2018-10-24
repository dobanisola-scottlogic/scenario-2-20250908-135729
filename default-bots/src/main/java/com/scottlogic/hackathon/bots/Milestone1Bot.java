package com.scottlogic.hackathon.bots;

import com.scottlogic.hackathon.bots.move.TimidMove;
import com.scottlogic.hackathon.game.Bot;
import com.scottlogic.hackathon.game.GameState;
import com.scottlogic.hackathon.game.Move;
import com.scottlogic.hackathon.game.Position;

import java.util.Collections;
import java.util.HashSet;
import java.util.LinkedList;
import java.util.List;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

public class Milestone1Bot extends Bot {
    private final List<TimidMove> moves = new LinkedList<>();

    public Milestone1Bot() {
        super("Milestone 1");
    }

    @Override
    public List<Move> makeMoves(final GameState gameState) {
        gameState.getRemovedPlayers()
                .forEach(player -> moves.removeIf(move -> move.getPlayer().equals(player.getId())));

        final Set<UUID> previousPlayers = moves.stream().map(Move::getPlayer).collect(Collectors.toSet());

        final Set<Position> myPlayerPositions = new HashSet<>();
        final Set<Position> opponentPlayerPositions = new HashSet<>();
        gameState.getPlayers().forEach(player -> {
            if (player.getOwner().equals(getId())) {
                myPlayerPositions.add(player.getPosition());
                if (!previousPlayers.contains(player.getId())) {
                    moves.add(new TimidMove(gameState.getMap(), player));
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

        moves.forEach(move -> {
            move.setMyPlayersPositions(myPlayerPositions);
            move.setOpponentPlayersPositions(opponentPlayerPositions);
            move.addOutOfBoundsPositions(gameState.getOutOfBoundsPositions());
            move.addSpawnPoints(gameState.getSpawnPoints());
            move.setCollectables(gameState.getCollectables());
            move.phase();
        });

        return Collections.unmodifiableList(moves);
    }
}
