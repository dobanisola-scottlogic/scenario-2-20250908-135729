package com.scottlogic.hackathon.server.models;

import com.google.inject.Inject;
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


    public Game create(final User user, final GameConfiguration gameConfiguration) {

        final java.util.Map<UUID, UploadedBot> activeUploadedBots = botService
                .getActiveBots(user)
                .stream()
                .collect(Collectors.toMap(uploadedBot -> uploadedBot.getTeamId(), Function.identity()));

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
            final java.util.Set<TeamBot> teamBots = teams.values()
                    .stream()
                    .map(team -> {
                        final UploadedBot uploadedBot = activeUploadedBots.get(team.getId());
                        return new TeamBot(team, uploadedBot.getBot());
                    })
                    .collect(Collectors.toSet());

            final Set<String> teamsWithoutBots = teamBots
                    .stream()
                    .filter(teamBot -> teamBot.getBot() == null)
                    .map(teamBot -> teamBot.getTeam().getName())
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
                game = new Game(teamBots, map);
            }
        }
        return game;
    }
}
