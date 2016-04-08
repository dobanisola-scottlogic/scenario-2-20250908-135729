package com.scottlogic.hackathon.game;

import java.util.UUID;

public interface Collectable {
    UUID getId();
    Type getType();
    Position getPosition();
    enum Type {
        PLAYER
    }
}
