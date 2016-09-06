package com.scottlogic.hackathon.bots;

import com.scottlogic.hackathon.bots.move.MoveBase;
import com.scottlogic.hackathon.bots.state.StateAnalyser;
import com.scottlogic.hackathon.game.*;

import java.lang.reflect.InvocationTargetException;
import java.util.*;
import java.util.Map;
import java.util.stream.Collectors;

public class Milestone3Bot extends Bot {
    private final List<MoveBase> moves = new LinkedList<>();

    private Set<Position> outOfBoundsPositions = new HashSet<>();
    private SpawnPoint spawnPoint;
    private Set<SpawnPoint> opponentSpawnPoints = new HashSet<>();

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
            } else {
                opponentPlayerPositions.add(player.getPosition());
            }
        });

        final Set<Position> outOfBoundsPositions = gameState.getOutOfBoundsPositions().stream().collect(Collectors.toSet());
        final Set<SpawnPoint> spawnPoints = gameState.getSpawnPoints().stream().collect(Collectors.toSet());
        final Set<Collectable> collectables = gameState.getCollectables().stream().collect(Collectors.toSet());

        addOutOfBoundsPositions(outOfBoundsPositions);
        addSpawnPoints(spawnPoints);

        StateAnalyser stateAnalyser = new StateAnalyser(gameState,
                playerPositions,
                opponentPlayerPositions,
                this.outOfBoundsPositions,
                spawnPoint,
                opponentSpawnPoints,
                collectables,
                mapWidth,
                mapHeight);
        Map<Class, Integer> initialMoveCounts = moves
                .stream()
                .collect(Collectors.toMap(move -> move.getClass(), move -> 1, (count, moveCount) -> count + moveCount));
        stateAnalyser.setMoveCounts(initialMoveCounts);

        gameState.getPlayers().forEach(player -> {
            if (player.getOwner().equals(getId())) {
                if (!previousPlayers.contains(player.getId())) {
                    // Determines which bot is selected
                    stateAnalyser.setPlayer(player);
                    try {
                        stateAnalyser.setMove(null);
                    } catch (final NoSuchMethodException e) {
                        e.printStackTrace();
                    } catch (final InstantiationException e) {
                        e.printStackTrace();
                    } catch (final IllegalAccessException e) {
                        e.printStackTrace();
                    } catch (final InvocationTargetException e) {
                        e.printStackTrace();
                    }
                    moves.add(stateAnalyser.getMove());
                    Map<Class, Integer> moveCounts = moves
                            .stream()
                            .collect(Collectors.toMap(iteratedMove -> iteratedMove.getClass(), iteratedMove -> 1, (count, moveCount) -> count + moveCount));
                    stateAnalyser.setMoveCounts(moveCounts);
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
            move.setPlayersPositions(playerPositions);
            move.setOpponentPlayerPositions(opponentPlayerPositions);
            move.addOutOfBoundsPositions(outOfBoundsPositions);
            move.addSpawnPoints(spawnPoints);
            move.setCollectables(collectables);
            move.phase();
        });

        final Set<MoveBase> myInactivePlayerMoves = moves
                .stream()
                .filter(move -> move.getPlayer().equals(getId()) && !move.isActive())
                .collect(Collectors.toSet());
        moves.removeIf(move -> myInactivePlayerMoves.contains(move));
        for (MoveBase move : myInactivePlayerMoves) {
            Player movePlayer = gameState.getPlayers()
                    .stream()
                    .filter(player -> player.getId().equals(move.getPlayer()))
                    .collect(Collectors.toList())
                    .get(0);
            stateAnalyser.setPlayer(movePlayer);
            try {
                stateAnalyser.setMove(move);
            } catch (final NoSuchMethodException e) {
                e.printStackTrace();
            } catch (final InstantiationException e) {
                e.printStackTrace();
            } catch (final IllegalAccessException e) {
                e.printStackTrace();
            } catch (final InvocationTargetException e) {
                e.printStackTrace();
            }
            moves.add(stateAnalyser.getMove());
            Map<Class, Integer> moveCounts = moves
                    .stream()
                    .collect(Collectors.toMap(iteratedMove -> iteratedMove.getClass(), iteratedMove -> 1, (count, moveCount) -> count + moveCount));
            stateAnalyser.setMoveCounts(moveCounts);
        }

        return Collections.unmodifiableList(moves);
    }

    public void addOutOfBoundsPositions(Set<Position> outOfBoundsPositions) {
        outOfBoundsPositions.stream()
                .filter(outOfBoundsPosition -> !this.outOfBoundsPositions.contains(outOfBoundsPosition))
                .forEach(outOfBoundsPosition -> {
                    this.outOfBoundsPositions.add(outOfBoundsPosition);
                });
        this.outOfBoundsPositions = outOfBoundsPositions;
    }

    public void addSpawnPoints(Set<SpawnPoint> spawnPoints) {
        if (spawnPoints.size() > 0) {
            if (spawnPoint == null) {
                List<SpawnPoint> spawnPointList = spawnPoints.stream()
                        .filter(spawnPoint -> spawnPoint.getOwner() == getId())
                        .collect(Collectors.toList());
                if (spawnPointList.size() > 0) {
                    spawnPoint = spawnPointList.get(0);
                }
            }
            spawnPoints.stream()
                    .filter(spawnPoint -> spawnPoint.getOwner() != getId() && !this.opponentSpawnPoints.contains(spawnPoint))
                    .forEach(spawnPoint -> {
                        this.opponentSpawnPoints.add(spawnPoint);
                    });
        }
    }

    @Override
    public String getDisplayName() {
        return "Milestone 3 Bot";
    }
}
