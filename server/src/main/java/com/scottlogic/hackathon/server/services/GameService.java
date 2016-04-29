package com.scottlogic.hackathon.server.services;

import com.google.inject.Inject;
import com.scottlogic.hackathon.game.Bot;
import com.scottlogic.hackathon.game.engine.GameEngine;
import com.scottlogic.hackathon.server.authentication.User;
import com.scottlogic.hackathon.server.models.GameConfiguration;
import com.scottlogic.hackathon.server.models.GameResult;
import com.scottlogic.hackathon.server.models.Team;
import com.scottlogic.hackathon.server.models.UploadedBot;
import com.scottlogic.hackathon.server.services.stores.GameStore;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.UUID;
import java.util.function.Function;
import java.util.stream.Collectors;

public class GameService {
    private final Logger logger;
    private final GameStore gameStore;
    private final TeamService teamService;
    private final BotService botService;

    @Inject
    public GameService(
            final GameStore gameStore,
            final TeamService teamService,
            final BotService botService) {
        logger = LoggerFactory.getLogger(this.getClass().getName());
        this.gameStore = gameStore;
        this.teamService = teamService;
        this.botService = botService;
    }

    public GameResult playGame(final User user, final GameConfiguration gameConfiguration) {
        final Map<UUID, UploadedBot> activeUploadedBots = botService.getActiveBots(user)
                .stream()
                .collect(Collectors.toMap(uploadedBot -> uploadedBot.getTeamId(), Function.identity()));

        final Set<Bot> bots = gameConfiguration.getTeams()
                .stream()
                .map(teamName -> {
                    Team team = teamService.getTeam(teamName);
                    UploadedBot uploadedBot = activeUploadedBots.get(team.getId());
                    return uploadedBot.getBot();
                })
                .collect(Collectors.toSet());

        final GameEngine gameEngine = GameEngine.create(gameConfiguration.getMap(), bots);
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
        return gameStore.getGameResults();
    }

    public GameResult getGameResult(final UUID id) {
        return gameStore.getGameResult(id);
    }
}