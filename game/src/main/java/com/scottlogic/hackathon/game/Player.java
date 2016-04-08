package com.scottlogic.hackathon.game;

import java.util.UUID;

public interface Player {
    UUID getId();
    UUID getOwner();
    Position getPosition();
}
