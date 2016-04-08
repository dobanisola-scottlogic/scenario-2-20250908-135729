package com.scottlogic.hackathon.game;

import java.util.UUID;

public interface SpawnPoint {
    UUID getId();
    UUID getOwner();
    Position getPosition();
}
