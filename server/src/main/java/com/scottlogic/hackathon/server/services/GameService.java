package com.scottlogic.hackathon.server.services;

import com.google.inject.Inject;
import com.scottlogic.hackathon.game.Bot;
import com.scottlogic.hackathon.game.engine.GameEngine;
import com.scottlogic.hackathon.server.authentication.User;
import com.scottlogic.hackathon.server.models.Game;
import com.scottlogic.hackathon.server.models.GameConfiguration;
import com.scottlogic.hackathon.server.models.GameFactory;
import com.scottlogic.hackathon.server.models.GameResult;
import com.scottlogic.hackathon.server.models.Team;
import com.scottlogic.hackathon.server.services.stores.GameStore;
import org.hibernate.criterion.Restrictions;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.UUID;
import java.util.concurrent.ThreadFactory;
import java.util.stream.Collectors;

public class GameService {
    private final Logger logger;
    private final GameStore gameStore;
    private final GameFactory gameFactory;
    private final ThreadFactory botThreadFactory;

    @Inject
    public GameService(GameStore gameStore, GameFactory gameFactory, @BotThreadFactory ThreadFactory botThreadFactory) {
        logger = LoggerFactory.getLogger(this.getClass().getName());
        this.gameStore = gameStore;
        this.gameFactory = gameFactory;
        this.botThreadFactory = botThreadFactory;
    }

    public GameResult playGame(final User user, final GameConfiguration gameConfiguration, Map<Team, Bot> teamBotMap) {
        final Game game = gameFactory.create(teamBotMap, gameConfiguration);
        GameResult gameResult = null;
        if (game != null) {
            final Set<Bot> bots = teamBotMap
                    .values()
                    .stream()
                    .collect(Collectors.toSet());
            final GameEngine gameEngine = GameEngine.create(gameConfiguration.getMap(), bots, botThreadFactory);
            try {
                final com.scottlogic.hackathon.game.GameResult engineGameResult = gameEngine.play();
                gameResult = GameResult.create(game, engineGameResult);
                gameStore.saveOrUpdate(gameResult);
            } catch (final Exception ex) {
                logger.error("Error playing game", ex);
            } finally {
                gameEngine.dispose();
            }
        }
        return gameResult;
    }

    public List<GameResult> getGameResults() {
        return gameStore.list();
    }

    public List<GameResult> getGameResultsByHackathon(final String hackathonId) {
        return gameStore.list(Restrictions.eq("hackathonId", hackathonId));
    }

    public GameResult getGameResult(final UUID id) {
        return gameStore.get(id);
    }

    public boolean deleteGameResult(final UUID id) {
        return gameStore.delete(id);
    }
}