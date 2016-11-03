package com.scottlogic.hackathon.server.resources;

import com.codahale.metrics.annotation.Timed;
import com.google.common.base.Optional;
import com.google.inject.Inject;
import com.scottlogic.hackathon.game.Bot;
import com.scottlogic.hackathon.server.HackathonConfiguration;
import com.scottlogic.hackathon.server.authentication.Authorizer;
import com.scottlogic.hackathon.server.authentication.User;
import com.scottlogic.hackathon.server.models.Team;
import com.scottlogic.hackathon.server.models.UploadedBot;
import com.scottlogic.hackathon.server.models.UploadedJar;
import com.scottlogic.hackathon.server.services.BotService;
import com.scottlogic.hackathon.server.services.JarService;
import com.scottlogic.hackathon.server.services.RemoteClassLoader;
import com.scottlogic.hackathon.server.services.TeamService;
import com.scottlogic.hackathon.server.services.stores.ActiveBot;
import io.dropwizard.auth.Auth;
import io.dropwizard.hibernate.UnitOfWork;
import org.glassfish.jersey.media.multipart.FormDataParam;

import javax.annotation.security.RolesAllowed;
import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import java.io.IOException;
import java.io.InputStream;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.UUID;
import java.util.jar.JarEntry;
import java.util.jar.JarInputStream;

@Path("/bot")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class BotResource {
    private final BotService botService;
    private final HackathonConfiguration hackathonConfiguration;
    private final TeamService teamService;
    private final JarService jarService;

    @Inject
    BotResource(final HackathonConfiguration hackathonConfiguration,
                final BotService botService,
                final TeamService teamService,
                final JarService jarService) {
        this.hackathonConfiguration = hackathonConfiguration;
        this.botService = botService;
        this.teamService = teamService;
        this.jarService = jarService;
    }

    @POST
    @UnitOfWork
    @Timed
    @Consumes(MediaType.MULTIPART_FORM_DATA)
    @Produces(MediaType.APPLICATION_JSON)
    @RolesAllowed({Authorizer.ROLE_ADMIN, Authorizer.ROLE_TEAM})
    public UploadedJar jarUploaded(@Auth final User user,
                                      @FormDataParam("file") final InputStream inputStream) throws IOException {
        UploadedJar jar = new UploadedJar(inputStream);

        Set<String> contestantBots = new HashSet<>();

        JarInputStream jarInputStream = new JarInputStream(jar.getInputStream());
        JarEntry jarEntry;

        do {
            jarEntry = jarInputStream.getNextJarEntry();

            if (jarEntry != null) {
                String fileName = jarEntry.getName();

                if (fileName.startsWith("com/contestantbots/") && fileName.endsWith(".class")) {
                    Bot loadedBot = null;

                    final RemoteClassLoader remoteClassLoader = new RemoteClassLoader(jar.getData());
                    try {
                        loadedBot = (Bot) remoteClassLoader.loadClass(fileName.replace("/", ".").replace(".class", "")).newInstance();
                        contestantBots.add(fileName);
                    } catch (final ClassNotFoundException | InstantiationException | IllegalAccessException e) {
                        e.printStackTrace();
                    }
                }
            }
        }
        while (jarEntry != null);

        jarInputStream.close();
        jar.setContestantBots(contestantBots);

        if (contestantBots.size() > 0) {
            jarService.addJar(jar);
        }

        return jar;
    }

    @POST
    @UnitOfWork
    @Path("{botClassName}")
    @Consumes(MediaType.MULTIPART_FORM_DATA)
    @Produces(MediaType.APPLICATION_JSON)
    @RolesAllowed({Authorizer.ROLE_TEAM, Authorizer.ROLE_ADMIN})
    public UploadedBot addBot(@Auth final User user,
                                    @PathParam("botClassName") final String botClassName,
                                    @FormDataParam("teamName") final Optional<String> teamName,
                                    @FormDataParam("id") final UUID jarId) throws IOException, ClassNotFoundException, IllegalAccessException, InstantiationException {
        UploadedBot addedBot = null;
        UploadedJar jar = jarService.getJar(jarId);

        if (jar != null) {
            InputStream inputStream = jar.getInputStream();
            jarService.deleteJar(jarId);

            String name = user.getName();
            if (teamName.isPresent() && user.isAdmin()) {
                name = teamName.orNull();
            }
            final Team team = teamService.getTeam(name);
            if (user.isAdmin()) {
                addedBot = botService.addBot(team, botClassName, inputStream);
            }
            else {
                addedBot = botService.addTeamBot(user, team, botClassName, inputStream);
            }
        }

        return addedBot;
    }

    @GET
    @UnitOfWork
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
    @UnitOfWork
    @Timed
    @Path("/{id}")
    @RolesAllowed({Authorizer.ROLE_ADMIN, Authorizer.ROLE_TEAM})
    public void deleteBot(@Auth final User user, @PathParam("id") final UUID id) {
        botService.deleteUploadedBot(user, id);
    }

    @PUT
    @UnitOfWork
    @Timed
    @Path("/active")
    @RolesAllowed({Authorizer.ROLE_ADMIN, Authorizer.ROLE_TEAM})
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public UploadedBot setActiveBot(@Auth final User user, final ActiveBot activeBot) {
        return botService.setActiveBot(user, activeBot);
    }
}
