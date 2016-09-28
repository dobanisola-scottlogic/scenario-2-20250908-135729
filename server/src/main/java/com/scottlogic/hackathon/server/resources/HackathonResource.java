package com.scottlogic.hackathon.server.resources;

import com.codahale.metrics.annotation.Timed;
import com.fasterxml.jackson.annotation.JsonView;
import com.google.inject.Inject;
import com.scottlogic.hackathon.server.HackathonConfiguration;
import com.scottlogic.hackathon.server.authentication.Authorizer;
import com.scottlogic.hackathon.server.authentication.User;
import com.scottlogic.hackathon.server.models.GameResult;
import com.scottlogic.hackathon.server.models.Hackathon;
import com.scottlogic.hackathon.server.models.Team;
import com.scottlogic.hackathon.server.models.Views;
import com.scottlogic.hackathon.server.services.GameService;
import com.scottlogic.hackathon.server.services.HackathonService;
import com.scottlogic.hackathon.server.services.TeamService;
import io.dropwizard.auth.Auth;

import javax.annotation.security.RolesAllowed;
import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import java.util.List;
import java.util.UUID;

@Path("/hackathon")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class HackathonResource {
    private final HackathonConfiguration hackathonConfiguration;
    private final HackathonService hackathonService;
    private final GameService gameService;
    private final TeamService teamService;

    @Inject
    public HackathonResource(final HackathonConfiguration hackathonConfiguration,
                             final HackathonService hackathonService,
                             final GameService gameService,
                             final TeamService teamService) {
        this.hackathonConfiguration = hackathonConfiguration;
        this.hackathonService = hackathonService;
        this.gameService = gameService;
        this.teamService = teamService;
    }

    @POST
    @Timed
    @RolesAllowed(Authorizer.ROLE_ADMIN)
    @JsonView(Views.Details.class)
    public Hackathon createHackathon(@Auth final User user, final Hackathon hackathon) {
        return hackathonService.createHackathon(user, hackathon);
    }

    @GET
    @Timed
    @JsonView(Views.List.class)
    public List<Hackathon> getHackathons() {
        List<Hackathon> hackathons = hackathonService.getHackathons();
        for (Hackathon hackathon:hackathons) {
            hackathon.setGames(gameService.getGameResultsByHackathon(hackathon.getId()));
            hackathon.setTeams(teamService.getTeamsByHackathon(hackathon.getId()));
        }
        return hackathons;
    }

    @GET
    @Timed
    @Path("/{id}")
    @JsonView(Views.Details.class)
    public Hackathon getHackathon(@PathParam("id") final UUID id) {
        Hackathon hackathon = hackathonService.getHackathon(id);
        hackathon.setGames(gameService.getGameResultsByHackathon(id));
        hackathon.setTeams(teamService.getTeamsByHackathon(id));
        return hackathon;
    }

    @DELETE
    @Timed
    @Path("/{id}")
    @RolesAllowed(Authorizer.ROLE_ADMIN)
    public void deleteHackathon(@PathParam("id") final UUID id) {
        List<Team> teamsToDelete = teamService.getTeamsByHackathon(id);
        for (Team team : teamsToDelete) {
            teamService.deleteTeam(team.getId());
        }
        List<GameResult> gameResultsToDelete = gameService.getGameResultsByHackathon(id);
        for (GameResult gameResult : gameResultsToDelete) {
            gameService.deleteGameResult(gameResult.getId());
        }
        hackathonService.deleteHackathon(id);
    }
}
