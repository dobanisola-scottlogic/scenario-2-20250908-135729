package com.scottlogic.hackathon.server.services;

import java.io.IOException;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import com.google.inject.Inject;
import com.google.inject.Singleton;
import io.dropwizard.hibernate.UnitOfWork;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.scottlogic.hackathon.game.Bot;
import com.scottlogic.hackathon.game.Id;
import com.scottlogic.hackathon.remote.RemoteBot;
import com.scottlogic.hackathon.remote.RemoteBotConnector;
import com.scottlogic.hackathon.remote.notify.ChangeEventListener;
import com.scottlogic.hackathon.remote.notify.RemoteBotChangeEvent;
import com.scottlogic.hackathon.remote.server.Sender;
import com.scottlogic.hackathon.server.models.Team;
import com.scottlogic.hackathon.server.models.TeamBot;
import com.scottlogic.hackathon.server.services.stores.BotStore;

import static java.util.Optional.ofNullable;

/**
 * The RemoteBotStore maintains a map that for each Team that have a Bot connected remotely contains
 * a {@linkplain RemoteBotConnector} object. The {@linkplain RemoteBotConnector} holds a reference
 * to the {@linkplain RemoteBot} and the current State of the connection. If a Team connects or
 * reconnects after a dropped connection then a new UUID is assigned to a new RemoteBot which is
 * then updated in the RemoteBotStore and the UUID for the current Team bot updated in the
 * {@linkplain BotStore}.
 */
@Singleton
public class RemoteBotStore implements ChangeEventListener<RemoteBotChangeEvent> {
  private final Logger logger;
  private final Map<String, RemoteBotConnector> teamBotMap;
  private final BotStore botStore;
  private TeamService teamService;

  @Inject
  RemoteBotStore(final BotStore botStore, final TeamService teamService) {
    this.botStore = botStore;
    this.teamService = teamService;
    teamBotMap = new ConcurrentHashMap<>();
    logger = LoggerFactory.getLogger(this.getClass().getName());
  }

  void save(Team team, RemoteBotConnector remote) {
    remote.addRemoteBotListener(this);
    teamBotMap.put(remote.getTeam(), remote);
    remote.getRemoteBot().ifPresent(bot -> storeTeamBot(team, bot));
  }

  public Optional<? extends Bot> get(Id id) {
    return teamBotMap.values().stream()
        .map(RemoteBotConnector::getRemoteBot)
        .filter(Optional::isPresent)
        .map(Optional::get)
        .filter(r -> r.getId().equals(id))
        .findAny();
  }

  public Optional<? extends Bot> get(String teamName) {
    return teamBotMap.get(teamName).getRemoteBot();
  }

  public void disconnect(Team team) {
    ofNullable(teamBotMap.get(team.getName()))
        .filter(RemoteBotConnector::isConnected)
        .flatMap(RemoteBotConnector::getRemoteSender)
        .ifPresent(this::attemptDisconnect);
  }

  private void attemptDisconnect(Sender sender) {
    try {
      logger.info("RemoteBotStore -> attempting disconnect");
      sender.sendDisconnect();
    } catch (IOException e) {
      e.printStackTrace();
    }
  }

  RemoteBotConnector.State getConnectionState(String teamName) {
    RemoteBotConnector.State state =
        ofNullable(teamBotMap.get(teamName))
            .map(RemoteBotConnector::getState)
            .orElseThrow(
                () ->
                    new RuntimeException(
                        "Attempt to get RemoteBotConnector.State for unknown remote team "
                            + teamName));

    logger.trace("getConnectionState( {} ) -> {}", teamName, state.name());
    return state;
  }

  private TeamBot storeTeamBot(Team team, RemoteBot bot) {
    logger.debug("storeTeamBot " + team.getName());
    if (botStore.deleteExisting(team.getId())) {
      logger.debug("removing old TeamBot before saving new one");
    }
    return botStore.saveOrUpdate(new TeamBot(team, bot.getId()));
  }

  @Override
  @UnitOfWork
  public void onChangeEvent(RemoteBotChangeEvent changeEvent) {
    botStore.runInSession(
        () -> {
          Team team = teamService.getTeam(changeEvent.getTarget());
          storeTeamBot(team, changeEvent.getNewValue());
        });
  }
}
