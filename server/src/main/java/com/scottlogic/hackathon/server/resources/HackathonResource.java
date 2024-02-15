package com.scottlogic.hackathon.server.resources;

import java.util.List;
import com.codahale.metrics.annotation.Timed;
import com.fasterxml.jackson.annotation.JsonView;
import com.google.inject.Inject;
import io.dropwizard.auth.Auth;
import io.dropwizard.hibernate.UnitOfWork;
import jakarta.annotation.security.RolesAllowed;
import jakarta.validation.constraints.NotNull;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.DELETE;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.PUT;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.Context;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.core.UriBuilder;
import jakarta.ws.rs.core.UriInfo;

import com.scottlogic.hackathon.server.HackathonConfiguration;
import com.scottlogic.hackathon.server.authentication.Authorizer;
import com.scottlogic.hackathon.server.authentication.User;
import com.scottlogic.hackathon.server.models.GameResult;
import com.scottlogic.hackathon.server.models.Hackathon;
import com.scottlogic.hackathon.server.models.HackathonUpdate;
import com.scottlogic.hackathon.server.models.Team;
import com.scottlogic.hackathon.server.models.Views;
import com.scottlogic.hackathon.server.services.GameService;
import com.scottlogic.hackathon.server.services.HackathonService;
import com.scottlogic.hackathon.server.services.TeamService;

@Path("/hackathon")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class HackathonResource {
  private final HackathonConfiguration hackathonConfiguration;
  private final HackathonService hackathonService;
  private final GameService gameService;
  private final TeamService teamService;

  @Inject
  public HackathonResource(
      final HackathonConfiguration hackathonConfiguration,
      final HackathonService hackathonService,
      final GameService gameService,
      final TeamService teamService) {
    this.hackathonConfiguration = hackathonConfiguration;
    this.hackathonService = hackathonService;
    this.gameService = gameService;
    this.teamService = teamService;
  }

  @POST
  @UnitOfWork
  @Timed
  @RolesAllowed(Authorizer.ROLE_ADMIN)
  @JsonView(Views.Details.class)
  public Response createHackathon(@Auth final User user, final Hackathon hackathon, @Context UriInfo uriInfo) {
    Hackathon createdHackathon = hackathonService.createHackathon(user, hackathon);

    UriBuilder uriBuilder = uriInfo.getAbsolutePathBuilder();

    uriBuilder.path(createdHackathon.getId());

    return Response.created(uriBuilder.build()).entity(createdHackathon).build();
  }

  @PUT
  @UnitOfWork
  @Timed
  @Path("/{id}")
  @RolesAllowed(Authorizer.ROLE_ADMIN)
  @Consumes(MediaType.APPLICATION_JSON)
  @Produces(MediaType.APPLICATION_JSON)
  public Response updateHackathon(@PathParam("id") final String id, final HackathonUpdate hackathonUpdate)
      throws IllegalArgumentException {
    Hackathon hackathon = hackathonService.updateHackathon(id, hackathonUpdate);

    return Response.ok(hackathon).build();
  }

  @GET
  @UnitOfWork
  @Timed
  @JsonView(Views.List.class)
  public Response getHackathons() {
    List<Hackathon> hackathons = hackathonService.getHackathons();

    if (hackathons == null || hackathons.isEmpty()) {
      return Response.noContent().build();
    }

    return Response.ok(hackathons).build();
  }

  @GET
  @UnitOfWork
  @Timed
  @Path("/{id}")
  @JsonView(Views.Details.class)
  public Response getHackathon(@NotNull @PathParam("id") final String id) {
    Hackathon hackathon = null;

    if (!id.equals("null")) {
      hackathon = hackathonService.getHackathon(id);
    }

    if (hackathon == null) {
      return Response.status(Response.Status.NOT_FOUND).build();
    }

    return Response.ok(hackathon).build();
  }

  @GET
  @UnitOfWork
  @Timed
  @Path("/team")
  @JsonView(Views.Details.class)
  @RolesAllowed(Authorizer.ROLE_TEAM)
  public Response getHackathonForTeam(@Auth final User user) {
    Team team = teamService.getTeam(user.getName());

    Hackathon hackathon = hackathonService.getHackathon(team.getHackathonId());

    if (hackathon == null) {
      return Response.noContent().build();
    }

    return Response.ok(hackathon).build();
  }

  @DELETE
  @UnitOfWork
  @Timed
  @Path("/{id}")
  @RolesAllowed(Authorizer.ROLE_ADMIN)
  public Response deleteHackathon(@PathParam("id") final String id) {
    // These actions should be handled in the service and wrapped in a transaction:
    List<Team> teamsToDelete = teamService.getTeamsByHackathon(id);

    for (Team team : teamsToDelete) {
      teamService.deleteTeam(team.getId());
    }

    List<GameResult> gameResultsToDelete = gameService.getGameResultsByHackathon(id);

    for (GameResult gameResult : gameResultsToDelete) {
      gameService.deleteGameResult(gameResult.getId());
    }

    hackathonService.deleteHackathon(id);

    // This action should return 204 No Content:
    return Response.noContent().build();
  }
}
