package com.scottlogic.hackathon.server.services.stores;


import com.scottlogic.hackathon.server.models.GameResult;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.UUID;

public class GameStore {
    List<GameResult> gameResults = new ArrayList<>();

    public void addGameResult(final GameResult gameResult) {
        gameResults.add(gameResult);
    }

    public GameResult getGameResult(final UUID id) {
        return gameResults.stream()
                .filter(gameResult -> gameResult.getId().equals(id))
                .findFirst()
                .orElse(null);
    }

    public List<GameResult> getGameResults() {
        return Collections.unmodifiableList(gameResults);
    }
}
