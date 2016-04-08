package com.scottlogic.hackathon.game;

import java.util.UUID;

public interface Move {
    UUID getPlayer();
    Direction getDirection();
}
