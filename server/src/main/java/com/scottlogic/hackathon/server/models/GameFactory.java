package com.scottlogic.hackathon.server.models;

import com.google.inject.Inject;
import com.scottlogic.hackathon.game.Bot;
import com.scottlogic.hackathon.game.engine.maps.PlayableMap;
import com.scottlogic.hackathon.server.authentication.User;
import com.scottlogic.hackathon.server.services.BotService;
import com.scottlogic.hackathon.server.services.TeamService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.Set;
import java.util.UUID;
import java.util.function.Function;
import java.util.stream.Collectors;

public class GameFactory {
    private final TeamService teamService;
    private final BotService botService;
    private final Logger logger;

    @Inject
    public GameFactory(
            final TeamService teamService,
            final BotService botService) {
        this.teamService = teamService;
        this.botService = botService;
        logger = LoggerFactory.getLogger(this.getClass().getName());
    }

    public java.util.Map<Team, Bot> createTeamBots(final User user, final GameConfiguration gameConfiguration) {
        final java.util.Map<UUID, UploadedBot> activeUploadedBots = botService
                .getActiveBots(user)
                .stream()
                .collect(Collectors.toMap(uploadedBot -> uploadedBot.getTeamId(), Function.identity()));

        final java.util.Map<String, Team> teams = gameConfiguration
                .getTeams()
                .stream()
                .collect(Collectors.toMap(Function.identity(), teamName -> teamService.getTeam(teamName)));

        final java.util.Map<Team, Bot> teamBots = teams.values()
                .stream()
                .filter(team -> team != null)
                .collect(Collectors.toMap(Function.identity(), team -> {
                    final UploadedBot uploadedBot = activeUploadedBots.get(team.getId());
                    return uploadedBot.getBot();
                }));


        return teamBots;
    }

    public Game create(final java.util.Map<Team, Bot> teamBotMap, final GameConfiguration gameConfiguration) {
        final java.util.Map<String, Team> teams = gameConfiguration
                .getTeams()
                .stream()
                .collect(Collectors.toMap(Function.identity(), teamName -> teamService.getTeam(teamName)));

        final Set<String> unknowTeams = teams
                .entrySet()
                .stream()
                .filter(entry -> entry.getValue() == null)
                .map(entry -> entry.getKey())
                .collect(Collectors.toSet());


        Game game = null;
        if (unknowTeams.size() > 0) {
            logger.error(String.format("Team(s) unknown, %s", String.join(",", unknowTeams)));
        } else {
            final Set<String> teamsWithoutBots = teamBotMap
                    .entrySet()
                    .stream()
                    .filter(teamBot -> teamBot.getValue() == null)
                    .map(teamBot -> teamBot.getKey().getName())
                    .collect(Collectors.toSet());

            if (teamsWithoutBots.size() > 0) {
                logger.error(String.format("Team(s) without bots, %s", String.join(",", teamsWithoutBots)));
            } else {
                Map map = null;
                final String mapName = gameConfiguration.getMap();
                try {
                    final PlayableMap playableMap = PlayableMap.load(mapName);
                    map = Map.create(playableMap);
                } catch (final Exception e) {
                    logger.error(String.format("Loading PlayableMap %s failed", mapName), e);
                }
                final Set<GameTeam> gameTeams = teamBotMap.entrySet()
                        .stream()
                        .map(entry -> new GameTeam(entry.getKey().getId(), entry.getKey().getName(), entry.getValue().getId()))
                        .collect(Collectors.toSet());
                game = new Game(gameTeams, map, gameConfiguration.getHackathonId());
            }
        }
        return game;
    }
}
