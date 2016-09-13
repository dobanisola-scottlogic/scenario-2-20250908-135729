package com.scottlogic.hackathon.game;

import java.util.Set;

/**
 * A game's state.
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
    Map getMap();

    /**
     *
     * @return The out of bounds positions for the current game.
     */
    Set<Position> getOutOfBoundsPositions();

    /**
     *
     * @return The active players that are in the current game.
     */
    Set<Player> getPlayers();

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
     *
     * @return The destroyed spawn points that were removed after the previous phase.
     */
    Set<SpawnPoint> getRemovedSpawnPoints();

    /**
     *
     * @return The collectable items that are in the current game.
     */
    Set<Collectable> getCollectables();
}
