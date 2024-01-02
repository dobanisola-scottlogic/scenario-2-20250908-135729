package com.scottlogic.hackathon.server.services;

import java.util.*;
import java.util.Map.Entry;
import java.util.function.Function;
import java.util.function.Predicate;
import java.util.stream.Stream;
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
    String teamName = team.getName();
    logger.debug("Adding remote team bot: {}", teamName);

    if (remoteBotStore.getConnector(teamName).isPresent()) {
      logger.debug("Team: {} already connected.", teamName);
      return;
    }

    RemoteBotConnector remoteBotConnector = new RemoteBotConnector();
    remoteBotStore.save(team, remoteBotConnector);
    remoteBotConnector.waitForConnect(teamName);
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

  public Map<Team, Bot> createTeamBotMap(User user, GameConfiguration gameConfiguration) {
    var userAccessibleBots =
        this.getUserAccessibleBots(user).stream()
            .collect(toMap(TeamBot::getTeamId, Function.identity()));

    var allMilestoneBots =
        milestoneService.getMilestones().stream()
            .collect(toMap(MilestoneBot::getMilestoneClassName, Function.identity()));

    var teamBotMap =
        gameConfiguration.getTeams().stream()
            .filter(name -> !MilestoneBot.isMilestoneBot(name))
            .map(teamService::getTeam)
            .collect(toMap(Function.identity(), team -> getTeamBot(team, userAccessibleBots)));

    var milestoneBotMap =
            gameConfiguration.getTeams().stream()
                    .filter(MilestoneBot::isMilestoneBot)
                    .collect(toMap(Team::createTeam, name -> getMilestoneBot(name, allMilestoneBots)));

    return Stream.concat(teamBotMap.entrySet().stream(), milestoneBotMap.entrySet().stream())
        .collect(toMap(Map.Entry::getKey, Entry::getValue));
  }

  private Bot getTeamBot(Team team, Map<UUID, TeamBot> teamBots) {

    if (!teamBots.containsKey(team.getId())) {
      throw new IllegalArgumentException("Team " + team.getName() + " has no bots.");
    }

    return remoteBotStore
        .get(teamBots.get(team.getId()).getId())
        .map(b -> (Bot) b)
        .orElseThrow(
            () ->
                new IllegalArgumentException(
                    "Team " + team.getName() + " is not connected to the server."));
  }

  private Bot getMilestoneBot(String name, Map<String, MilestoneBot> milestoneBots) {
    return ofNullable(milestoneBots.get(name))
        .map(MilestoneBot::getBot)
        .orElseThrow(() -> new IllegalArgumentException(name + " is not a valid milestone bot."));
  }

  private void removeOldMilestoneGames(Team team) {
    Set<String> milestoneClasses =
        milestoneService.getMilestones().stream()
            .map(MilestoneBot::getMilestoneClassName)
            .collect(toSet());
    gameService.deleteMileStoneGameResults(team, milestoneClasses);
  }
}
