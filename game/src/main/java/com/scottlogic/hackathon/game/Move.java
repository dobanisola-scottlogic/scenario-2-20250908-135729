package com.scottlogic.hackathon.game;

import java.util.UUID;

/**
 * A player's movement.
 */
public interface Move {
    /**
     *
     * @return The id of the player carrying out the movement.
     */
    UUID getPlayer();

    /**
     *
     * @return The direction of the movement.
     */
    Direction getDirection();
}
