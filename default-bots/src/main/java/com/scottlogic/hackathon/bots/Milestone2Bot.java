package com.scottlogic.hackathon.bots;

import com.scottlogic.hackathon.bots.move.MoveBase;
import com.scottlogic.hackathon.bots.state.ProportionalStateSelector;
import com.scottlogic.hackathon.bots.state.ProportionalTransitionSelector;
import com.scottlogic.hackathon.game.*;

import java.lang.reflect.InvocationTargetException;
import java.util.*;
import java.util.Map;
import java.util.stream.Collectors;

public class Milestone2Bot extends Bot {
    private final List<MoveBase> moves = new LinkedList<>();

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

        final Map<Class, Integer> moveCounts = moves
                .stream()
                .collect(Collectors.toMap(move -> move.getClass(), move -> 1, (count, moveCount) -> count + moveCount));

        final Set<Position> playerPositions = new HashSet<>();
        final Set<Position> opponentPlayerPositions = new HashSet<>();
        gameState.getPlayers().forEach(player -> {
            if (player.getOwner().equals(getId())) {
                playerPositions.add(player.getPosition());
                if (!previousPlayers.contains(player.getId())) {
                    // Determines which bot is selected
                    ProportionalStateSelector proportionalStateSelector = null;
                    try {
                        proportionalStateSelector = new ProportionalStateSelector(moveCounts, mapWidth, mapHeight, player);
                    } catch (final InvocationTargetException e) {
                        e.printStackTrace();
                    } catch (final NoSuchMethodException e) {
                        e.printStackTrace();
                    } catch (final InstantiationException e) {
                        e.printStackTrace();
                    } catch (final IllegalAccessException e) {
                        e.printStackTrace();
                    }
                    moves.add(proportionalStateSelector.getMove());
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

        final Set<MoveBase> inactivePlayerMoves = moves
                .stream()
                .filter(move -> move.getPlayer().equals(getId()) && !move.isActive())
                .collect(Collectors.toSet());
        moves.removeIf(move -> inactivePlayerMoves.contains(move));
        for (final MoveBase move : inactivePlayerMoves) {
            final Player movePlayer = gameState.getPlayers()
                    .stream()
                    .filter(player -> player.getId().equals(move.getPlayer()))
                    .collect(Collectors.toList())
                    .get(0);
            ProportionalTransitionSelector proportionalTransitionSelector = null;
            try {
                proportionalTransitionSelector = new ProportionalTransitionSelector(moveCounts, move, mapWidth, mapHeight, movePlayer);
            } catch (final InvocationTargetException e) {
                e.printStackTrace();
            } catch (final NoSuchMethodException e) {
                e.printStackTrace();
            } catch (final InstantiationException e) {
                e.printStackTrace();
            } catch (final IllegalAccessException e) {
                e.printStackTrace();
            }
            moves.add(proportionalTransitionSelector.getMove());
        }

        return Collections.unmodifiableList(moves);
    }
}
