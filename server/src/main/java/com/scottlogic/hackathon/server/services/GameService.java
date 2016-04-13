package com.scottlogic.hackathon.server.services;

import com.google.inject.Inject;
import com.scottlogic.hackathon.bots.ConsistentRandomBot;
import com.scottlogic.hackathon.game.Bot;
import com.scottlogic.hackathon.game.engine.GameEngine;
import com.scottlogic.hackathon.server.models.GameResult;
import com.scottlogic.hackathon.server.services.stores.GameStore;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

public class GameService {
    private final Logger logger;
    private final GameStore gameStore;

    @Inject
    public GameService(final GameStore gameStore) {
        logger = LoggerFactory.getLogger(this.getClass().getName());
        this.gameStore = gameStore;
    }

    public GameResult playGame() {
        final Set<Bot> bots = new HashSet<Bot>();
        bots.add(new ConsistentRandomBot());
        bots.add(new ConsistentRandomBot());
        bots.add(new ConsistentRandomBot());
        bots.add(new ConsistentRandomBot());

        final GameEngine gameEngine = GameEngine.create("FourPlayerCross", bots);
        GameResult gameResult = null;
        try {
            final com.scottlogic.hackathon.game.GameResult engineGameResult = gameEngine.play();
            gameResult = GameResult.create(engineGameResult);
            gameStore.addGameResult(gameResult);
        } catch (final Exception ex) {
            logger.error("Error playing game", ex);
        }
        return gameResult;
    }

    public List<UUID> getGameResults() {
        return gameStore
                .getGameResults()
                .stream()
                .map(gameResult -> gameResult.getId())
                .collect(Collectors.toList());
    }

    public GameResult getGameResult(final UUID id) {
        return gameStore.getGameResult(id);
    }
}
