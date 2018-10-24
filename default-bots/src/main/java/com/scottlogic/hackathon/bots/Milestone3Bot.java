package com.scottlogic.hackathon.bots;

import com.scottlogic.hackathon.bots.move.MoveBase;
import com.scottlogic.hackathon.bots.state.StateAnalyser;
import com.scottlogic.hackathon.game.Bot;
import com.scottlogic.hackathon.game.GameState;
import com.scottlogic.hackathon.game.Move;
import com.scottlogic.hackathon.game.Player;
import com.scottlogic.hackathon.game.Position;
import com.scottlogic.hackathon.game.SpawnPoint;

import java.lang.reflect.InvocationTargetException;
import java.util.Collections;
import java.util.HashSet;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

public class Milestone3Bot extends Bot {
    private final List<MoveBase> moves = new LinkedList<>();

    private Set<Position> outOfBoundsPositions = new HashSet<>();
    private SpawnPoint spawnPoint;
    private Set<SpawnPoint> opponentSpawnPoints = new HashSet<>();

    public Milestone3Bot() {
        super("Milestone 3");
    }

    @Override
    public void initialise(final GameState initialGameState) {
        initialGameState.getSpawnPoints().stream()
                .filter(spawnPoint -> spawnPoint.getOwner() == getId())
                .findFirst()
                .ifPresent(spawnPoint -> this.spawnPoint = spawnPoint);
    }

    @Override
    public List<Move> makeMoves(final GameState gameState) {
        gameState.getRemovedPlayers()
                .forEach(player -> moves.removeIf(move -> move.getPlayer().equals(player.getId())));

        final Set<UUID> previousPlayers = moves.stream().map(MoveBase::getPlayer).collect(Collectors.toSet());

        final Set<Position> playerPositions = new HashSet<>();
        final Set<Position> opponentPlayerPositions = new HashSet<>();
        gameState.getPlayers().forEach(player -> {
            if (player.getOwner().equals(getId())) {
                playerPositions.add(player.getPosition());
            } else {
                opponentPlayerPositions.add(player.getPosition());
            }
        });

        this.outOfBoundsPositions.addAll(gameState.getOutOfBoundsPositions());
        addSpawnPoints(gameState.getSpawnPoints());

        final StateAnalyser stateAnalyser = new StateAnalyser(
                gameState,
                playerPositions,
                opponentPlayerPositions,
                outOfBoundsPositions,
                spawnPoint,
                opponentSpawnPoints,
                gameState.getCollectables()
        );
        Map<Class, Integer> initialMoveCounts = moves.stream().collect(
                Collectors.toMap(Move::getClass, move -> 1, Integer::sum)
        );
        stateAnalyser.setMoveCounts(initialMoveCounts);

        gameState.getPlayers().forEach(player -> {
            if (player.getOwner().equals(getId())) {
                if (!previousPlayers.contains(player.getId())) {
                    // Determines which bot is selected
                    stateAnalyser.setPlayer(player);
                    try {
                        stateAnalyser.setMove(null);
                    } catch (final NoSuchMethodException | InstantiationException | IllegalAccessException |
                            InvocationTargetException e) {
                        e.printStackTrace();
                    }
                    moves.add(stateAnalyser.getMove());
                    stateAnalyser.setMoveCounts(moves.stream()
                            .collect(Collectors.toMap(Move::getClass, iteratedMove -> 1, Integer::sum))
                    );
                } else {
                    moves.forEach(move -> {
                        if (move.getPlayer().equals(player.getId())) {
                            move.setPlayerPosition(player.getPosition());
                        }
                    });
                }
            }
        });

        moves.forEach(move -> {
            move.setMyPlayersPositions(playerPositions);
            move.setOpponentPlayersPositions(opponentPlayerPositions);
            move.addOutOfBoundsPositions(outOfBoundsPositions);
            move.addSpawnPoints(gameState.getSpawnPoints());
            move.setCollectables(gameState.getCollectables());
            move.phase();
        });

        final Set<MoveBase> myInactivePlayerMoves = moves
                .stream()
                .filter(move -> move.getPlayer().equals(getId()) && !move.isActive())
                .collect(Collectors.toSet());
        moves.removeIf(myInactivePlayerMoves::contains);
        for (MoveBase move : myInactivePlayerMoves) {
            Player movePlayer = gameState.getPlayers()
                    .stream()
                    .filter(player -> player.getId().equals(move.getPlayer()))
                    .collect(Collectors.toList())
                    .get(0);
            stateAnalyser.setPlayer(movePlayer);
            try {
                stateAnalyser.setMove(move);
            } catch (final NoSuchMethodException | InstantiationException | IllegalAccessException |
                    InvocationTargetException e) {
                e.printStackTrace();
            }
            moves.add(stateAnalyser.getMove());
            Map<Class, Integer> moveCounts = moves.stream().collect(
                    Collectors.toMap(Move::getClass, iteratedMove -> 1, Integer::sum)
            );
            stateAnalyser.setMoveCounts(moveCounts);
        }

        return Collections.unmodifiableList(moves);
    }

    private void addSpawnPoints(final Set<SpawnPoint> spawnPoints) {
        if (spawnPoints.size() > 0) {
            spawnPoints.stream()
                    .filter(spawnPoint -> spawnPoint.getOwner() != getId())
                    .forEach(spawnPoint -> this.opponentSpawnPoints.add(spawnPoint));
        }
    }
}
