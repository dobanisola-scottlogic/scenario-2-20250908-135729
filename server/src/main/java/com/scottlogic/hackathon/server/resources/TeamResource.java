package com.scottlogic.hackathon.server.resources;

import com.codahale.metrics.annotation.Timed;
import com.google.inject.Inject;
import com.scottlogic.hackathon.server.HackathonConfiguration;
import com.scottlogic.hackathon.server.authentication.Authorizer;
import com.scottlogic.hackathon.server.models.Team;
import com.scottlogic.hackathon.server.services.TeamService;
import com.scottlogic.hackathon.server.services.stores.TeamUpdate;

import javax.annotation.security.RolesAllowed;
import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import java.util.List;
import java.util.UUID;

@Path("/team")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class TeamResource {
    private final HackathonConfiguration hackathonConfiguration;
    private final TeamService teamService;

    @Inject
    public TeamResource(final HackathonConfiguration hackathonConfiguration,
                        final TeamService teamService) {
        this.hackathonConfiguration = hackathonConfiguration;
        this.teamService = teamService;
    }

    @POST
    @Timed
    @RolesAllowed(Authorizer.ROLE_ADMIN)
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Team addTeam(final Team team) {
        return teamService.addTeam(team);
    }

    @PUT
    @Timed
    @Path("/{id}")
    @RolesAllowed(Authorizer.ROLE_ADMIN)
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Team updateTeam(@PathParam("id") final UUID id, final TeamUpdate teamUpdate) {
        return teamService.updateTeam(id, teamUpdate);
    }

    @GET
    @Timed
    @RolesAllowed(Authorizer.ROLE_ADMIN)
    public List<Team> getTeams() {
        return teamService.getTeams();
    }

    @GET
    @Timed
    @Path("/{id}")
    @RolesAllowed(Authorizer.ROLE_ADMIN)
    public Team getTeam(@PathParam("id") final UUID id) {
        return teamService.getTeam(id);
    }

    @DELETE
    @Timed
    @Path("/{id}")
    @RolesAllowed(Authorizer.ROLE_ADMIN)
    public void deleteTeam(@PathParam("id") final UUID id) {
        teamService.deleteTeam(id);
    }
}