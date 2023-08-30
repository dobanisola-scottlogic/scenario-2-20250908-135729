package com.scottlogic.hackathon.server.models;

import java.util.Set;
import java.util.function.Function;
import java.util.stream.Collectors;
import com.google.inject.Inject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.scottlogic.hackathon.game.Bot;
import com.scottlogic.hackathon.game.engine.maps.MapFileReader;
import com.scottlogic.hackathon.server.services.MilestoneService;
import com.scottlogic.hackathon.server.services.TeamService;

public class GameFactory {
  private final TeamService teamService;
  private final MilestoneService milestoneService;
  private final Logger logger;

  @Inject
  public GameFactory(final TeamService teamService, final MilestoneService milestoneService) {
    this.teamService = teamService;
    this.milestoneService = milestoneService;
    logger = LoggerFactory.getLogger(this.getClass().getName());
  }

  public Game create(
      final java.util.Map<Team, Bot> teamBotMap, final GameConfiguration gameConfiguration) {
    final java.util.Map<String, Team> teams =
        gameConfiguration.getTeams().stream()
            .collect(
                Collectors.toMap(
                    Function.identity(),
                    teamName -> {
                      if (teamName.contains(MilestoneBot.MILESTONE_BOT_PREFIX)) {
                        Team adminTeam = new Team();
                        adminTeam.setName("ADMIN");
                        return adminTeam;
                      } else {
                        return teamService.getTeam(teamName);
                      }
                    }));

    final Set<String> unknownTeams =
        teams.entrySet().stream()
            .filter(entry -> entry.getValue() == null)
            .map(entry -> entry.getKey())
            .collect(Collectors.toSet());

    if (unknownTeams.size() > 0) {
      logger.error(String.format("Team(s) unknown, %s", String.join(",", unknownTeams)));
      return null;
    }

    final Set<String> teamsWithoutBots =
        teamBotMap.entrySet().stream()
            .filter(teamBot -> teamBot.getValue() == null)
            .map(teamBot -> teamBot.getKey().getName())
            .collect(Collectors.toSet());

    if (teamsWithoutBots.size() > 0) {
      logger.error(String.format("Team(s) without bots, %s", String.join(",", teamsWithoutBots)));
      return null;
    }

    final ArenaModel arena;
    final String mapName = gameConfiguration.getMap();
    try {
      arena = ArenaModel.create(new MapFileReader().readMapFile(mapName));
    } catch (final Exception e) {
      logger.error(String.format("Loading Arena '%s' failed", mapName), e);
      return null;
    }

    final Set<GameTeam> gameTeams =
        teamBotMap.entrySet().stream()
            .map(
                entry ->
                    new GameTeam(
                        entry.getKey().getId(), entry.getKey().getName(), entry.getValue().getId()))
            .collect(Collectors.toSet());
    return new Game(gameTeams, arena, gameConfiguration.getHackathonId());
  }
}
