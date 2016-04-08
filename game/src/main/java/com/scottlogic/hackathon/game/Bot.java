package com.scottlogic.hackathon.game;

import java.util.List;
import java.util.UUID;

public interface Bot {
    List<Move> makeMoves(GameState gameState);
    UUID getId();
    void setId(UUID id);
}
