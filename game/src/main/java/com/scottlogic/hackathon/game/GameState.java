package com.scottlogic.hackathon.game;

import java.util.Optional;
import java.util.Set;

/**
 * A 'view' of the state of a game.
 * Instances of this are often not complete,
 * instead corresponding to what a particular {@linkplain Bot}'s {@linkplain Player Players} can 'see'.
 */
public interface GameState {

    /**
     *
     * @return The current phase of the game. The phase starts at 0 and simply counts up
     *         during the game.
     */
    int getPhase();

    /**
     *
     * @return The game's map.
     */
    GameGeometry getMap();

    /**
     *
     * @return The out of bounds positions for the current game.
     */
    Set<Position> getOutOfBoundsPositions();

    /**
     * Checks whether the given position is out of bounds.
     * @param position The position to check
     * @return {@code true} iff the position is out of bounds
     */
    default boolean isOutOfBounds(Position position) {
        return getOutOfBoundsPositions().contains(position);
    }

    /**
     *
     * @return The active players that are in the current game.
     */
    Set<Player> getPlayers();

    /**
     * Gets the {@linkplain Player} at the given position, if there is one.
     * @param position The position to get the player at
     * @return The player at the requested position,
     *         or an {@linkplain Optional#empty() empty Optional} if there is none
     */
    default Optional<Player> getPlayerAt(Position position) {
        return getPlayers().parallelStream()
                .filter(p -> p.getPosition().equals(position))
                .findAny();
    }

    /**
     *
     * @return The dead players that were removed after the previous phase.
     */
    Set<Player> getRemovedPlayers();

    /**
     *
     * @return The active spawn points in the current game.
     */
    Set<SpawnPoint> getSpawnPoints();

    /**
     * Gets the {@linkplain SpawnPoint} at the given position, if there is one.
     * @param position The position to get the SpawnPoint at
     * @return The SpawnPoint at the requested position,
     *         or an {@linkplain Optional#empty() empty Optional} if there is none
     */
    default Optional<SpawnPoint> getSpawnPointAt(Position position) {
        return getSpawnPoints().parallelStream()
                .filter(p -> p.getPosition().equals(position))
                .findAny();
    }

    /**
     *
     * @return The destroyed spawn points that were removed after the previous phase.
     */
    Set<SpawnPoint> getRemovedSpawnPoints();

    /**
     *
     * @return The collectable items that are in the current game.
     */
    Set<Collectable> getCollectables();

    /**
     * Gets the {@linkplain Collectable} at the given position, if there is one.
     * @param position The position to get the Collectable at
     * @return The Collectable at the requested position,
     *         or an {@linkplain Optional#empty() empty Optional} if there is none
     */
    default Optional<Collectable> getCollectableAt(Position position) {
        return getCollectables().parallelStream()
                .filter(p -> p.getPosition().equals(position))
                .findAny();
    }

    /**
     * Determines if the given position is accessible (i.e. not {@linkplain #isOutOfBounds(Position) out of bounds})
     * and doesn't contain a player, spawn point, or collectable.
     * @param position The position to check
     * @return {@code true} iff the givien position is empty
     */
    default boolean isEmpty(Position position) {
        return !(isOutOfBounds(position)
                || getPlayerAt(position).isPresent()
                || getSpawnPointAt(position).isPresent()
                || getCollectableAt(position).isPresent());
    }

}
