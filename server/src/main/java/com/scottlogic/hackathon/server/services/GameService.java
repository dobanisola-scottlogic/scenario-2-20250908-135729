package com.scottlogic.hackathon.server.services;

import com.google.inject.Inject;
import com.scottlogic.hackathon.game.Bot;
import com.scottlogic.hackathon.game.engine.GameEngine;
import com.scottlogic.hackathon.server.authentication.User;
import com.scottlogic.hackathon.server.models.*;
import com.scottlogic.hackathon.server.services.stores.GameStore;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

public class GameService {
    private final Logger logger;
    private final GameStore gameStore;
    private final GameFactory gameFactory;

    @Inject
    public GameService(
            final GameStore gameStore,
            final GameFactory gameFactory) {
        logger = LoggerFactory.getLogger(this.getClass().getName());
        this.gameStore = gameStore;
        this.gameFactory = gameFactory;
    }


    public GameResult playGame(final User user, final GameConfiguration gameConfiguration) {
        final Map<Team, Bot> teamBotMap = gameFactory.createTeamBots(user, gameConfiguration);
        final Game game = gameFactory.create(teamBotMap, gameConfiguration);
        GameResult gameResult = null;
        if (game != null) {
            final Set<Bot> bots = teamBotMap
                    .values()
                    .stream()
                    .collect(Collectors.toSet());
            final GameEngine gameEngine = GameEngine.create(gameConfiguration.getMap(), bots);
            try {
                final com.scottlogic.hackathon.game.GameResult engineGameResult = gameEngine.play();
                gameResult = GameResult.create(game, engineGameResult);
                gameStore.addGameResult(gameResult);
            } catch (final Exception ex) {
                logger.error("Error playing game", ex);
            } finally {
                gameEngine.dispose();
            }
        }
        return gameResult;
    }

    public List<GameResult> getGameResults() {
        return gameStore.getGameResults();
    }

    public List<GameResult> getGameResultsByHackathon(final UUID hackathonId) {
        return gameStore.getGameResultsByHackathon(hackathonId);
    }

    public GameResult getGameResult(final UUID id) {
        return gameStore.getGameResult(id);
    }

    public boolean deleteGameResult(final UUID id) {
        return gameStore.deleteGameResult(id);
    }
}