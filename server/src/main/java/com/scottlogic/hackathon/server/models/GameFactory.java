package com.scottlogic.hackathon.server.models;

import com.google.inject.Inject;
import com.scottlogic.hackathon.game.Bot;
import com.scottlogic.hackathon.game.engine.maps.PlayableMap;
import com.scottlogic.hackathon.server.services.MilestoneService;
import com.scottlogic.hackathon.server.services.TeamService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.Set;
import java.util.function.Function;
import java.util.stream.Collectors;

public class GameFactory {
    private final TeamService teamService;
    private final MilestoneService milestoneService;
    private final Logger logger;

    @Inject
    public GameFactory(
            final TeamService teamService,
            final MilestoneService milestoneService) {
        this.teamService = teamService;
        this.milestoneService = milestoneService;
        logger = LoggerFactory.getLogger(this.getClass().getName());
    }

    public Game create(final java.util.Map<Team, Bot> teamBotMap, final GameConfiguration gameConfiguration) {
        final java.util.Map<String, Team> teams = gameConfiguration
                .getTeams()
                .stream()
                .collect(Collectors.toMap(Function.identity(), teamName -> {
                    if (teamName.contains(MilestoneBot.MILESTONE_BOT_PREFIX)) {
                        Team adminTeam = new Team();
                        adminTeam.setName("ADMIN");
                        return adminTeam;
                    } else {
                        return teamService.getTeam(teamName);
                    }
                }));

        final Set<String> unknownTeams = teams
                .entrySet()
                .stream()
                .filter(entry -> entry.getValue() == null)
                .map(entry -> entry.getKey())
                .collect(Collectors.toSet());


        Game game = null;
        if (unknownTeams.size() > 0) {
            logger.error(String.format("Team(s) unknown, %s", String.join(",", unknownTeams)));
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
