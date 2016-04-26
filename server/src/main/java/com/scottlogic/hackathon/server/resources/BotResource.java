package com.scottlogic.hackathon.server.resources;

import com.codahale.metrics.annotation.Timed;
import com.google.inject.Inject;
import com.scottlogic.hackathon.server.HackathonConfiguration;
import com.scottlogic.hackathon.server.authentication.Authorizer;
import com.scottlogic.hackathon.server.authentication.User;
import com.scottlogic.hackathon.server.models.Team;
import com.scottlogic.hackathon.server.models.UploadedBot;
import com.scottlogic.hackathon.server.services.BotService;
import com.scottlogic.hackathon.server.services.TeamService;
import io.dropwizard.auth.Auth;

import javax.annotation.security.RolesAllowed;
import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import java.io.InputStream;
import java.util.List;
import java.util.UUID;

@Path("/bot")
@Produces(MediaType.APPLICATION_JSON)
@Consumes("*/*")
public class BotResource {
    private final BotService botService;
    private final HackathonConfiguration hackathonConfiguration;
    private final TeamService teamService;

    @Inject
    BotResource(final HackathonConfiguration hackathonConfiguration,
                final BotService botService,
                final TeamService teamService) {
        this.hackathonConfiguration = hackathonConfiguration;
        this.botService = botService;
        this.teamService = teamService;
    }

    @POST
    @Path("{botClassName}")
    @Consumes("*/*")
    @Produces(MediaType.APPLICATION_JSON)
    @RolesAllowed(Authorizer.ROLE_TEAM)
    public UploadedBot fileUploaded(@Auth final User user,
                                    @PathParam("botClassName") final String botClassName,
                                    final InputStream inputStream) {
        final Team team = teamService.getTeam(user.getName());
        return botService.addBot(team, botClassName, inputStream);
    }

    @GET
    @Timed
    @RolesAllowed({Authorizer.ROLE_ADMIN, Authorizer.ROLE_TEAM})
    public List<UploadedBot> getUploadedBots(@Auth final User user) {
        return botService.getUploadedBots(user);
    }

    @DELETE
    @Timed
    @Path("/{id}")
    @RolesAllowed({Authorizer.ROLE_ADMIN, Authorizer.ROLE_TEAM})
    public void deleteBot(@Auth final User user, @PathParam("id") final UUID id) {
        botService.deleteUploadedBot(user, id);
    }
}
