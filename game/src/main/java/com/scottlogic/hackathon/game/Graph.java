package com.scottlogic.hackathon.game;

import com.scottlogic.hackathon.game.Direction;
import com.scottlogic.hackathon.game.Map;
import com.scottlogic.hackathon.game.Position;
import com.scottlogic.hackathon.game.Route;
import org.hworblehat.jraph.AStar;
import org.hworblehat.jraph.DirectedGraph;

import java.util.Objects;
import java.util.Optional;
import java.util.function.Predicate;
import java.util.stream.Collectors;
import java.util.stream.Stream;

/**
 * Graph search algorithms for {@linkplain Map Maps}.
 */
class Graph {

    /**
     * Finds (one of) the shortest route between the two given {@linkplain Position positions} on the {@linkplain Map},
     * avoiding any positions that match the given predicate.
     * This method uses the <a href="https://en.wikipedia.org/wiki/A*_search_algorithm">A* search algorithm</a>.
     * <p>
     * It is possible that no route will be found,
     * if the set of positions that must be avoided forms an unbroken barrier between the start and target positions.
     * In this situation, and empty {@linkplain Optional} will be returned.
     *
     * @param map The Map on which to find a route
     * @param from The Position to find a route from
     * @param to The Position to find a route to
     * @param avoid A {@linkplain Predicate} specifying which positions to avoid.
     *              The found route is guaranteed not to include any positions for which this returns {@code true}.
     * @return An Optional containing an ordered list of the directions to move in to traverse the found route,
     *         or {@linkplain Optional#empty() empty} if no route could be found
     */
    public static Optional<Route> findRoute(Map map, Position from, Position to, Predicate<Position> avoid) {
        return AStar.findIntRoute(Objects.requireNonNull(from), Objects.requireNonNull(to),
                        new MapGraph(Objects.requireNonNull(map), Objects.requireNonNull(avoid)), map::distance)
                .map(route -> map.route(from,
                        route.getEdges().stream().map(Edge::getDirection).collect(Collectors.toList())));
    }

    private static final class Edge {

        private final Position from;
        private final Direction direction;

        Edge(Position from, Direction direction) {
            this.from = from;
            this.direction = direction;
        }

        Direction getDirection() {
            return direction;
        }

        Position getFrom() {
            return from;
        }

        @Override
        public int hashCode() {
            return Objects.hash(from, direction);
        }

        @Override
        public boolean equals(Object obj) {
            if(obj==this) return true;
            if(!(obj instanceof Edge)) return false;
            Edge o = (Edge) obj;
            return direction==o.direction && from.equals(o.from);
        }
    }

    private static class MapGraph implements DirectedGraph<Position, Edge, Integer> {

        private final com.scottlogic.hackathon.game.Map map;
        private final Predicate<Position> avoid;

        MapGraph(Map map, Predicate<Position> avoid) {
            this.map = map;
            this.avoid = avoid;
        }

        @Override
        public Stream<Edge> getOutgoingEdges(Position vertex) {
            return Stream.of(Direction.values())
                    .filter(d -> !avoid.test(map.getNeighbour(vertex, d)))
                    .map(d -> new Edge(vertex, d));
        }

        @Override
        public Position getStartVertex(Edge edge) {
            return edge.getFrom();
        }

        @Override
        public Position getEndVertex(Edge edge) {
            return map.getNeighbour(edge.getFrom(), edge.getDirection());
        }

        @Override
        public Integer getCost(Edge edge) {
            return 1;
        }
    }

}
