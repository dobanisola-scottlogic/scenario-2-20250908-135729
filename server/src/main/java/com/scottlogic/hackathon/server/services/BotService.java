package com.scottlogic.hackathon.server.services;

import java.util.*;
import java.util.function.Function;
import java.util.function.Predicate;
import com.google.inject.Inject;
import com.google.inject.Singleton;
import org.hibernate.criterion.Restrictions;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.scottlogic.hackathon.game.Bot;
import com.scottlogic.hackathon.remote.RemoteBotConnector;
import com.scottlogic.hackathon.server.authentication.User;
import com.scottlogic.hackathon.server.models.*;
import com.scottlogic.hackathon.server.services.stores.BotStore;

import static java.util.Optional.ofNullable;
import static java.util.stream.Collectors.*;

@Singleton
public class BotService {
  private final Logger logger;
  private final BotStore botStore;
  private final TeamService teamService;
  private final GameService gameService;
  private final MilestoneService milestoneService;
  private final HackathonService hackathonService;
  private final RemoteBotStore remoteBotStore;

  @Inject
  public BotService(
      final BotStore botStore,
      final TeamService teamService,
      final GameService gameService,
      final MilestoneService milestoneService,
      final HackathonService hackathonService,
      final RemoteBotStore remoteBotStore) {
    this.botStore = botStore;
    this.teamService = teamService;
    this.gameService = gameService;
    this.milestoneService = milestoneService;
    this.hackathonService = hackathonService;
    this.remoteBotStore = remoteBotStore;

    botStore.configureIdGenerator();
    logger = LoggerFactory.getLogger(this.getClass().getName());
  }

  public void addRemoteTeamBot(final Team team) {
    logger.debug("Adding remote team bot:{}", team.getName());
    RemoteBotConnector remoteBotConnector = new RemoteBotConnector();
    remoteBotConnector.waitForConnect(team.getName());
    remoteBotStore.save(team, remoteBotConnector);
    logger.debug(
        "Team: {} -> connection status {}",
        remoteBotConnector.getTeam(),
        remoteBotConnector.getState());
  }

  public GameResult playMilestone(
      final User user, final Team team, final String milestone, final String map) {
    logger.debug("Team:{} playing milestone game.", team.getName());
    if (getRemoteTeamBotConnectionState(team) == RemoteBotConnector.State.CONNECTED) {
      Hackathon hackathon = hackathonService.getHackathon(team.getHackathonId());

      GameConfiguration gameConfiguration =
          new GameConfiguration(
              new HashSet<>(
                  Arrays.asList(team.getName(), MilestoneBot.MILESTONE_BOT_PREFIX + milestone)),
              map,
              hackathon.getId());
      removeOldMilestoneGames(team);
      return gameService.playGameDebug(
          user, gameConfiguration, createTeamBotMap(user, gameConfiguration));
    } else {
      logger.error("Team:{} cannot play default game as not currently connected!.", team.getName());
    }
    return null;
  }

  public RemoteBotConnector.State getRemoteTeamBotConnectionState(final Team team) {
    return remoteBotStore.getConnectionState(team.getName());
  }

  public void disconnectRemoteTeamBot(final Team team) {
    remoteBotStore.disconnect(team);
  }

  public List<TeamBot> getTeamBots(final User user) {
    final List<TeamBot> allVisibleBots;
    if (user.isAdmin()) {
      allVisibleBots = botStore.list();
    } else {
      allVisibleBots = this.getTeamBots(user.getName());
    }
    return allVisibleBots;
  }

  public List<TeamBot> getTeamBots(final String userName) {
    final Team team = teamService.getTeam(userName);
    return botStore.list(Restrictions.eq("teamId", team.getId().toString()));
  }

  private boolean userCanAccessBot(final User user, final UUID id) {
    return user.isAdmin()
        || (user.isTeam()
            && isTeamBot(teamService.getTeam(user.getName()), botStore.getByTeamId(id)));
  }

  private boolean isTeamBot(Team team, TeamBot teamBot) {
    Predicate<TeamBot> isUserTeamBot =
        bot -> Objects.nonNull(bot) && bot.getTeamId().equals(team.getId());
    return isUserTeamBot.test(teamBot);
  }

  private List<TeamBot> getUserAccessibleBots(final User user) {
    return botStore.list().stream()
        .filter(b -> userCanAccessBot(user, b.getTeamId()))
        .collect(toUnmodifiableList());
  }

  public Map<Team, Bot> createTeamBotMap(
      final User user, final GameConfiguration gameConfiguration) {
    final var userAccessibleBots =
        this.getUserAccessibleBots(user).stream()
            .collect(toMap(TeamBot::getTeamId, Function.identity()));

    final var milestoneBots =
        milestoneService.getMilestones().stream()
            .collect(toMap(MilestoneBot::getMilestoneClassName, Function.identity()));

    final var teams =
        gameConfiguration.getTeams().stream().collect(toMap(Function.identity(), this::getTeam));

    return teams.values().stream()
        .filter(Objects::nonNull)
        .collect(
            toMap(
                Function.identity(),
                team -> getTeamOrMileStoneBot(team, userAccessibleBots, milestoneBots)));
  }

  private Team getTeam(String teamName) {
    if (teamName.startsWith(MilestoneBot.MILESTONE_BOT_PREFIX)) {
      Team adminTeam = new Team();
      adminTeam.setName(teamName);
      return adminTeam;
    } else {
      return teamService.getTeam(teamName);
    }
  }

  private Bot getTeamOrMileStoneBot(
      Team team, Map<UUID, TeamBot> teamBots, Map<String, MilestoneBot> milestoneBots) {
    return ofNullable(team.getId())
        .flatMap(id -> remoteBotStore.get(teamBots.get(id).getId()).map(b -> (Bot) b))
        .orElseGet(() -> milestoneBots.get(team.getName()).getBot());
  }

  private void removeOldMilestoneGames(Team team) {
    Set<String> milestoneClasses =
        milestoneService.getMilestones().stream()
            .map(MilestoneBot::getMilestoneClassName)
            .collect(toSet());
    gameService.deleteMileStoneGameResults(team, milestoneClasses);
  }
}
