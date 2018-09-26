package com.scottlogic.hackathon.game;

import java.util.stream.Stream;

/**
 * The map of a game. This includes information and methods relating to the map's overall size and shape.
 * It does <em>not</em> define the locations of
 * {@linkplain GameState#getOutOfBoundsPositions() obstacles}, {@linkplain GameState#getCollectables() collectables},
 * {@linkplain GameState#getPlayers() players}, or {@linkplain GameState#getSpawnPoints() spawn points}.
 * Information about these elements must be obtained from the {@linkplain GameState},
 * and will be limited by what your players can see.
 * Information in <em>this class</em> is universal, and does not depend on the position of your players.
 */
public interface Map {

    /**
     * @return The width of the map
     */
    int getWidth();

    /**
     * @return The height of the map
     */
    int getHeight();

    /**
     * Calculates the position on the current map that is displaced by the specified distance and direction from the
     * given position.
     * @param from The position from which to calculate the relative position
     * @param direction The direction of the position to calculate from the <b>from</b> position
     * @param distance The distance of the position to calculate from the <b>from</b> position
     * @return The calculated relative position
     */
    Position getRelativePosition(Position from, Direction direction, int distance);

    /**
     * Determines the position that is next to the given position in the specified direction.
     * @param from The position to find the neighbour of
     * @param direction The direction of the neighbour to find from the <b>from</b> position
     * @return The calculated neighbour
     */
    default Position getNeighbour(Position from, Direction direction) {
        return getRelativePosition(from, direction, 1);
    }

    /**
     * Determines the absolute horizontal distance between two positions.
     * This is defined as smallest number of phases it would take for a player to move from one position until
     * it had the same x-coordinate as the other position,
     * assuming there are no {@linkplain GameState#getOutOfBoundsPositions() obstacles} in the way.
     *
     * @param a One of the positions to find the distance between
     * @param b The other of the positions to find the distance between
     * @return The horizontal distance in number of phases
     */
    int xDistance(Position a, Position b);

    /**
     * Determines the absolute vertical distance between two positions.
     * This is defined as smallest number of phases it would take for a player to move from one position until
     * it had the same y-coordinate as the other position,
     * assuming there are no {@linkplain GameState#getOutOfBoundsPositions() obstacles} in the way.
     *
     * @param a One of the positions to find the distance between
     * @param b The other of the positions to find the distance between
     * @return The vertical distance in number of phases
     */
    int yDistance(Position a, Position b);

    /**
     * Determines the distance between two positions.
     * This is defined as smallest number of phases it would take for a player to move from one position to the other,
     * assuming there are no {@linkplain GameState#getOutOfBoundsPositions() obstacles} between them.
     *
     * @param a One of the positions to find the distance between
     * @param b The other of the positions to find the distance between
     * @return The distance, in number of phases
     */
    default int distance(Position a, Position b) {
        int dx = xDistance(a, b);
        int dy = yDistance(a, b);

        return dx>dy ? dx : dy;
    }

    /**
     * Generates all {@linkplain Direction}s from one position that are towards another.
     * A direction is defined as <em>towards</em> the target position if moving a single step in that direction reduces
     * the {@linkplain #distance(Position, Position) distance} to the target position. It does not take account of
     * any obstacles that may be in the way.
     * <p>
     * Note that the returned stream will often contain more than one direction,
     * as several moves would result in a reduced distance to the target. It may also:
     * <ul>
     *     <li>Be empty - if the target and start point are the same</li>
     *     <li>Contain all directions - if the map is square and the target is on the exact opposite side</li>
     * </ul>
     *
     * @param from The starting position to determine the direction to move from
     * @param towards The target position to reduce the distance to
     * @return A stream of all Directions that are towards the target
     */
    default Stream<Direction> directionsTowards(Position from, Position towards) {
        int distance = distance(from, towards);

        return Stream.of(Direction.values())
                .filter(d -> distance(getNeighbour(from, d), towards) < distance);
    }

    /**
     * Generates all {@linkplain Direction}s from one position that are away from another.
     * A direction is defined as <em>away from</em> the avoided position if moving a single step in that direction
     * increases the {@linkplain #distance(Position, Position) distance} to the avoided position.
     * It does not take account of any obstacles that may be in the way.
     * <p>
     * Note that the returned stream will often contain more than one direction,
     * as several moves would result in an increased distance to the avoided position. It may also:
     * <ul>
     *     <li>Contain all directions - if the target and start point are the same</li>
     *     <li>Be empty - if the map is square and the target is on the exact opposite side</li>
     * </ul>
     *
     * @param from The starting position to determine the direction to move from
     * @param awayFrom The position to move away from (increase the distance to)
     * @return A stream of all Directions that are towards the target
     */
    default Stream<Direction> directionsAwayFrom(Position from, Position awayFrom) {
        int distance = distance(from, awayFrom);

        return Stream.of(Direction.values())
                .filter(d -> distance(getNeighbour(from, d), awayFrom) > distance);
    }

}