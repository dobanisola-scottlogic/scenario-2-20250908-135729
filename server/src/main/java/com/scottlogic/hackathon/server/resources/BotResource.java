package com.scottlogic.hackathon.server.resources;

import com.codahale.metrics.annotation.Timed;
import com.google.inject.Inject;
import com.scottlogic.hackathon.game.Bot;
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
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.UUID;
import java.util.jar.JarEntry;
import java.util.jar.JarInputStream;

@Path("/bot")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class BotResource {
    private static final String PACKAGE_ROOT = "com/contestantbots/";
    private static final String PACKAGE_ROOT_DOT_FORMAT = PACKAGE_ROOT.replace("/", ".");

    private final BotService botService;
    private final TeamService teamService;
    private final JarService jarService;

    @Inject
    BotResource(final BotService botService,
                final TeamService teamService,
                final JarService jarService) {
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
    public UploadedJar jarUploaded(@Auth final User user, @FormDataParam("file") final InputStream inputStream) {
        UploadedJar jar = new UploadedJar(inputStream);

        Set<String> contestantBots = new HashSet<>();
        Map<String, String> messageLookup = new HashMap<>();

        try {
            JarInputStream jarInputStream = new JarInputStream(jar.getInputStream());
            JarEntry jarEntry;

            do {
                jarEntry = jarInputStream.getNextJarEntry();

                if (jarEntry != null) {
                    String fileName = jarEntry.getName();

                    if (fileName.startsWith(PACKAGE_ROOT) && fileName.endsWith(".class")) {

                        final RemoteClassLoader remoteClassLoader = new RemoteClassLoader(jar.getData());
                        try {
                            Class loadedClass = remoteClassLoader.loadClass(fileName.replace("/", ".").replace(".class", ""));
                            Class superclass = loadedClass.getSuperclass();
                            if (superclass != null && superclass.equals(Bot.class)) {
                                try {
                                    loadedClass.newInstance();
                                    contestantBots.add(fileName);
                                } catch (final IllegalAccessException | InstantiationException e) {
                                    addMessage(messageLookup, fileName, e.getMessage());
                                }
                            }
                        } catch (final ClassNotFoundException | LinkageError e) {
                            addMessage(messageLookup, fileName, e.getMessage());
                        }
                    }
                }
            }
            while (jarEntry != null);

            jarInputStream.close();
            jar.setContestantBots(contestantBots);
            jar.setMessageLookup(messageLookup);

            if (contestantBots.size() > 0) {
                jarService.addJar(jar);
            } else {
                String message = "Bots do not extend com.scottlogic.hackathon.game.Bot, " +
                        "or are in the wrong package, which should start with '" + PACKAGE_ROOT_DOT_FORMAT + "'" +
                        (messageLookup.size() > 0 ? ", check other errors for further details" : "");
                addMessage(messageLookup,"No valid Bots", message);
            }
        } catch (final IOException e) {
            addMessage(messageLookup, "Jar file", "Problems reading the jar file: " + e.getMessage());
        }

        return jar;
    }

    private void addMessage(Map<String, String> messageLookup, String messageKey, String message) {
        int lastDelimiter = messageKey.lastIndexOf('/');
        messageLookup.put(messageKey.substring(lastDelimiter + 1).replace(".class", ""), message);
    }

    @POST
    @UnitOfWork
    @Path("{botClassName}")
    @Consumes(MediaType.MULTIPART_FORM_DATA)
    @Produces(MediaType.APPLICATION_JSON)
    @RolesAllowed({Authorizer.ROLE_TEAM, Authorizer.ROLE_ADMIN})
    public UploadedBot addBot(@Auth final User user,
                                    @PathParam("botClassName") final String botClassName,
                                    @FormDataParam("teamName") final String teamName,
                                    @FormDataParam("id") final UUID jarId) throws IOException, ClassNotFoundException, IllegalAccessException, InstantiationException {
        UploadedBot addedBot = null;
        UploadedJar jar = jarService.getJar(jarId);

        if (jar != null) {
            InputStream inputStream = jar.getInputStream();
            jarService.deleteJar(jarId);

            final Team team = teamService.getTeam(teamName != null && user.isAdmin() ? teamName : user.getName());

            if (user.isAdmin()) {
                addedBot = botService.addBot(team, botClassName, inputStream);
            } else {
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
                                             @QueryParam("teamName") String teamName) {
        List<UploadedBot> uploadedBots;
        if (teamName != null && user.isAdmin()) {
            uploadedBots = botService.getUploadedBots(teamName);
        } else {
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
