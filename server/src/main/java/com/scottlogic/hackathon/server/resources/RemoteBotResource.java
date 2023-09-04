package com.scottlogic.hackathon.server.resources;

import java.util.*;
import javax.annotation.security.RolesAllowed;
import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import com.codahale.metrics.annotation.Timed;
import com.google.inject.Inject;
import io.dropwizard.auth.Auth;
import io.dropwizard.hibernate.UnitOfWork;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.scottlogic.hackathon.server.authentication.Authorizer;
import com.scottlogic.hackathon.server.authentication.User;
import com.scottlogic.hackathon.server.models.GameResult;
import com.scottlogic.hackathon.server.models.Team;
import com.scottlogic.hackathon.server.models.TeamBot;
import com.scottlogic.hackathon.server.services.*;

@Path("/remotebot")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class RemoteBotResource {
  private static final String PACKAGE_ROOT = "com/contestantbots/";
  private static final String PACKAGE_ROOT_DOT_FORMAT = PACKAGE_ROOT.replace("/", ".");

  private final BotService botService;
  private final TeamService teamService;
  private final Logger logger;

  @Inject
  RemoteBotResource(final BotService botService, final TeamService teamService) {
    this.botService = botService;
    this.teamService = teamService;
    logger = LoggerFactory.getLogger(this.getClass().getName());
  }

  @POST
  @UnitOfWork
  @Timed
  @Path("/connect")
  @RolesAllowed(Authorizer.ROLE_TEAM)
  @Consumes(MediaType.TEXT_PLAIN)
  public void connect(@Auth final User user, final String teamName) {
    logger.debug("Connect to remote bot {}", teamName);
    Team team = teamService.getTeam(teamName);
    botService.addRemoteTeamBot(team);
  }

  @POST
  @UnitOfWork
  @Timed
  @Path("/disconnect")
  @RolesAllowed(Authorizer.ROLE_TEAM)
  @Consumes(MediaType.TEXT_PLAIN)
  public void disconnectTeam(@Auth final User user, final String teamName) {
    logger.info("Disconnect remote bot {}", teamName);
    Team team = teamService.getTeam(teamName);
    botService.disconnectRemoteTeamBot(team);
  }

  @POST
  @UnitOfWork
  @Timed
  @Path("/test")
  @RolesAllowed(Authorizer.ROLE_TEAM)
  public GameResult playTestGame(@Auth final User user, final TestGamePayload testGamePayload) {
    logger.debug("Connect to remote bot {} and play default", testGamePayload.getTeamName());
    Team team = teamService.getTeam(testGamePayload.getTeamName());
    GameResult gameResult =
        botService.playMilestone(
            user, team, testGamePayload.getMilestone(), testGamePayload.getMap());

    logger.debug("Connected and got game results, gameId: " + gameResult.getId());

    return gameResult;
  }

  @GET
  @UnitOfWork
  @Timed
  @Path("/connectedState")
  @Produces(MediaType.TEXT_PLAIN)
  @RolesAllowed({Authorizer.ROLE_ADMIN, Authorizer.ROLE_TEAM})
  public String getConnectionState(@Auth final User user, @QueryParam("teamName") String teamName) {
    logger.trace("Connect to remote bot {}", teamName);
    Team team = teamService.getTeam(teamName);
    try {
      return botService.getRemoteTeamBotConnectionState(team).name();
    } catch (RuntimeException e) {
      return "";
    }
  }

  @GET
  @UnitOfWork
  @Timed
  @RolesAllowed({Authorizer.ROLE_ADMIN, Authorizer.ROLE_TEAM})
  public List<TeamBot> getTeamBots(@Auth final User user, @QueryParam("teamName") String teamName) {
    List<TeamBot> teamBots;
    if (teamName != null && user.isAdmin()) {
      teamBots = botService.getTeamBots(teamName);
    } else {
      teamBots = botService.getTeamBots(user);
    }
    return teamBots;
  }
}
