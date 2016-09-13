package com.scottlogic.hackathon.game;

import java.util.UUID;

/**
 * A player (minion) in the game.
 */
public interface Player {
    /**
     *
     * @return The unique id of the current player.
     */
    UUID getId();

    /**
     *
     * @return The unique id of the owner of the current player.
     */
    UUID getOwner();

    /**
     *
     * @return The position of the current player.
     */
    Position getPosition();
}
