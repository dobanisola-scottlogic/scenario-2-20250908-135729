package com.scottlogic.hackathon.bots;

import com.scottlogic.hackathon.bots.move.*;
import com.scottlogic.hackathon.bots.state.ProportionalStateSelector;
import com.scottlogic.hackathon.bots.state.ProportionalTransitionSelector;
import com.scottlogic.hackathon.game.*;

import java.lang.reflect.InvocationTargetException;
import java.util.*;
import java.util.Map;
import java.util.stream.Collectors;

public class Milestone2Bot extends Bot {
    private final List<MoveBase> moves = new LinkedList<>();
    private final HashMap<Class, Integer> spawnProfile = createDesiredProportionsMap();
    private final HashMap<Class, Integer> transitionProfile = createDesiredProportionsMap();

    public Milestone2Bot() {
        super("Milestone 2");
    }

    private static HashMap<Class, Integer> createDesiredProportionsMap() {
        HashMap<Class, Integer> desiredProportionsMap = new HashMap<>();
        desiredProportionsMap.put(AttackMove.class, 20);
        desiredProportionsMap.put(CollectableMove.class, 80);
        desiredProportionsMap.put(DefendMove.class, 0);
        desiredProportionsMap.put(HunterMove.class, 10);
        desiredProportionsMap.put(TimidMove.class, 0);
        return desiredProportionsMap;
    }

    @Override
    public List<Move> makeMoves(final GameState gameState) {
        gameState.getRemovedPlayers()
                .forEach(player -> moves.removeIf(move -> move.getPlayer().equals(player.getId())));

        final Set<UUID> previousPlayers = moves
                .stream()
                .map(Move::getPlayer)
                .collect(Collectors.toSet());

        final Map<Class, Integer> moveCounts = moves
                .stream()
                .collect(Collectors.toMap(Move::getClass, move -> 1, (count, moveCount) -> count + moveCount));

        final Set<Position> playerPositions = new HashSet<>();
        final Set<Position> opponentPlayerPositions = new HashSet<>();
        gameState.getPlayers().forEach(player -> {
            if (player.getOwner().equals(getId())) {
                playerPositions.add(player.getPosition());
                if (!previousPlayers.contains(player.getId())) {
                    // Determines which bot is selected
                    try {
                        moves.add(
                                new ProportionalStateSelector(moveCounts, spawnProfile, gameState.getMap(), player)
                                        .getMove()
                        );
                    } catch (final InvocationTargetException | NoSuchMethodException | InstantiationException |
                            IllegalAccessException e) {
                        e.printStackTrace();
                    }
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

        final Set<Position> outOfBoundsPositions = new HashSet<>(gameState.getOutOfBoundsPositions());
        final Set<SpawnPoint> spawnPoints = new HashSet<>(gameState.getSpawnPoints());
        final Set<Collectable> collectables = new HashSet<>(gameState.getCollectables());
        moves.forEach(move -> {
            move.setMyPlayersPositions(playerPositions);
            move.setOpponentPlayersPositions(opponentPlayerPositions);
            move.addOutOfBoundsPositions(outOfBoundsPositions);
            move.addSpawnPoints(spawnPoints);
            move.setCollectables(collectables);
            move.phase();
        });

        final Set<MoveBase> inactivePlayerMoves = moves
                .stream()
                .filter(move -> move.getPlayer().equals(getId()) && !move.isActive())
                .collect(Collectors.toSet());
        moves.removeIf(inactivePlayerMoves::contains);
        for (final MoveBase move : inactivePlayerMoves) {
            final Player movePlayer = gameState.getPlayers()
                    .stream()
                    .filter(player -> player.getId().equals(move.getPlayer()))
                    .findFirst()
                    .get();
            try {
                moves.add(
                        new ProportionalTransitionSelector(moveCounts, transitionProfile, gameState.getMap(), move, movePlayer)
                                .getMove()
                );
            } catch (final InvocationTargetException | NoSuchMethodException | InstantiationException |
                    IllegalAccessException e) {
                e.printStackTrace();
            }
        }

        return Collections.unmodifiableList(moves);
    }
}
