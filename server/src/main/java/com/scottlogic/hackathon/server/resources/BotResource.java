package com.scottlogic.hackathon.server.resources;

import com.codahale.metrics.annotation.Timed;
import com.google.common.base.Optional;
import com.google.inject.Inject;
import com.scottlogic.hackathon.server.HackathonConfiguration;
import com.scottlogic.hackathon.server.authentication.Authorizer;
import com.scottlogic.hackathon.server.authentication.User;
import com.scottlogic.hackathon.server.models.Team;
import com.scottlogic.hackathon.server.models.UploadedBot;
import com.scottlogic.hackathon.server.services.BotService;
import com.scottlogic.hackathon.server.services.TeamService;
import com.scottlogic.hackathon.server.services.stores.ActiveBot;
import io.dropwizard.auth.Auth;
import org.glassfish.jersey.media.multipart.FormDataParam;

import javax.annotation.security.RolesAllowed;
import javax.validation.constraints.Null;
import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import java.io.InputStream;
import java.util.List;
import java.util.UUID;

@Path("/bot")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
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
    @Consumes(MediaType.MULTIPART_FORM_DATA)
    @Produces(MediaType.APPLICATION_JSON)
    @RolesAllowed({Authorizer.ROLE_TEAM, Authorizer.ROLE_ADMIN})
    public UploadedBot fileUploaded(@Auth final User user,
                                    @PathParam("botClassName") final String botClassName,
                                    @FormDataParam("teamName") final Optional<String> teamName,
                                    @FormDataParam("file") final InputStream inputStream) {
        String name = user.getName();
        if (teamName.isPresent() && user.isAdmin()) {
            name = teamName.orNull();
        }
        final Team team = teamService.getTeam(name);
        return botService.addBot(team, botClassName, inputStream);
    }

    @GET
    @Timed
    @RolesAllowed({Authorizer.ROLE_ADMIN, Authorizer.ROLE_TEAM})
    public List<UploadedBot> getUploadedBots(@Auth final User user,
                                             @QueryParam("teamName") Optional<String> teamName) {
        List<UploadedBot> uploadedBots;
        if (teamName.isPresent() && user.isAdmin()) {
            uploadedBots = botService.getUploadedBots(teamName.orNull());
        }
        else {
            uploadedBots = botService.getUploadedBots(user);
        }
        return uploadedBots;
    }

    @DELETE
    @Timed
    @Path("/{id}")
    @RolesAllowed({Authorizer.ROLE_ADMIN, Authorizer.ROLE_TEAM})
    public void deleteBot(@Auth final User user, @PathParam("id") final UUID id) {
        botService.deleteUploadedBot(user, id);
    }

    @GET
    @Timed
    @Path("/active")
    @RolesAllowed({Authorizer.ROLE_ADMIN, Authorizer.ROLE_TEAM})
    public List<UploadedBot> getActive(@Auth final User user) {
        return botService.getActiveBots(user);
    }

    @PUT
    @Timed
    @Path("/active")
    @RolesAllowed({Authorizer.ROLE_ADMIN, Authorizer.ROLE_TEAM})
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public UploadedBot setActiveBot(@Auth final User user, final ActiveBot activeBot) {
        return botService.setActiveBot(user, activeBot);
    }
}
