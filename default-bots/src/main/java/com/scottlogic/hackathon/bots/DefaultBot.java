package com.scottlogic.hackathon.bots;

import com.scottlogic.hackathon.game.*;

import java.util.*;
import java.util.stream.Collectors;

public class DefaultBot extends Bot {
    private final List<DirectionAndDistanceMove> moves = new LinkedList<DirectionAndDistanceMove>();

    public DefaultBot() {
        super("Default");
    }

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

        System.out.println("before route");
        Optional<Route> route = gameState.getMap().findRoute(new Position(0,0), new Position(12,0), gameState.getOutOfBoundsPositions());
        System.out.println("found a route");
        route.ifPresent(positions -> System.out.println("after route - length = " + positions.getLength() + " with direction " + positions.getFirstDirection().get()));

        moves.forEach(move -> move.phase());

        return Collections.unmodifiableList(moves);
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
