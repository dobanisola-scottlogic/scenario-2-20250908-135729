package com.scottlogic.hackathon.game;

import java.util.List;
import java.util.UUID;

public abstract class Bot {
    private final UUID id = UUID.randomUUID();

    public void initialise(final GameState gameState) {
    }

    public abstract List<Move> makeMoves(GameState gameState);

    public UUID getId() {
        return id;
    }

    public abstract  String getDisplayName();
}
