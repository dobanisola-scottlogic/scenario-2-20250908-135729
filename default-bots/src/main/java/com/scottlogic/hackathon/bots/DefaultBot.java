package com.scottlogic.hackathon.bots;

import com.scottlogic.hackathon.game.Bot;
import com.scottlogic.hackathon.game.Direction;
import com.scottlogic.hackathon.game.GameState;
import com.scottlogic.hackathon.game.Move;

import java.util.*;
import java.util.stream.Collectors;

public class DefaultBot extends Bot {
    private final List<DirectionAndDistanceMove> moves = new LinkedList<DirectionAndDistanceMove>();

    @Override
    public List<Move> makeMoves(final GameState gameState) {
        gameState.getRemovedPlayers().forEach(player -> {
            moves.removeIf(move -> move.getPlayer().equals(player.getId()));
        });
        final Set<UUID> previousPlayers = moves
                .stream()
                .map(move -> move.getPlayer())
                .collect(Collectors.toSet());

        gameState.getPlayers().forEach(player -> {
            if (player.getOwner().equals(getId()) && !previousPlayers.contains(player.getId())) {
                moves.add(new DirectionAndDistanceMove(player.getId()));
            }
        });

        moves.forEach(move -> move.phase());

        return Collections.unmodifiableList(moves);
    }

    @Override
    public String getDisplayName() {
        return "Default";
    }

    class DirectionAndDistanceMove implements Move {
        private final Direction[] directions = Direction.values();
        private final Random random = new Random();
        private final UUID player;
        private Direction direction;
        private int distance;

        public DirectionAndDistanceMove(final UUID player) {
            this.player = player;
        }

        void phase() {
            if (distance <= 0) {
                distance = random.nextInt(64);
                direction = directions[random.nextInt(directions.length)];
            } else {
                distance--;
            }
        }

        @Override
        public UUID getPlayer() {
            return player;
        }

        @Override
        public Direction getDirection() {
            return direction;
        }

        @Override
        public String toString() {
            return String.format("Player %s - Direction %s", player, direction);
        }
    }
}
