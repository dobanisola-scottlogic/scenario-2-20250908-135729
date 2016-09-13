package com.scottlogic.hackathon.game;

import java.util.UUID;

/**
 * A spawn point in the game.
 */
public interface SpawnPoint {
    /**
     *
     * @return The unique id of the current spawn point.
     */
    UUID getId();

    /**
     *
     * @return The unique id of the owner of the current spawn point.
     */
    UUID getOwner();

    /**
     *
     * @return The position of the current spawn point.
     */
    Position getPosition();
}
