package com.scottlogic.hackathon.game;

import java.util.UUID;

/**
 * A collectable item in the game.
 */
public interface Collectable {
    /**
     *
     * @return The unique id of the current collectable item.
     */
    UUID getId();

    /**
     *
     * @return the type of the current collectable item.
     */
    Type getType();

    /**
     *
     * @return The position of the collectable item.
     */
    Position getPosition();

    /**
     * Collectable item types
     */
    enum Type {
        /**
         * Item that generates a new player
         */
        PLAYER
    }
}
