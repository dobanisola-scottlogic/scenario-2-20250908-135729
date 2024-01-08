package com.scottlogic.hackathon.server.resources;

import java.util.List;
import java.util.Map;
import java.util.UUID;
import javax.annotation.security.RolesAllowed;
import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import com.codahale.metrics.annotation.Timed;
import com.fasterxml.jackson.annotation.JsonView;
import com.google.common.base.Optional;
import com.google.inject.Inject;
import io.dropwizard.auth.Auth;
import io.dropwizard.hibernate.UnitOfWork;
import org.hibernate.SessionFactory;

import com.scottlogic.hackathon.game.Bot;
import com.scottlogic.hackathon.server.authentication.Authorizer;
import com.scottlogic.hackathon.server.authentication.User;
import com.scottlogic.hackathon.server.models.GameConfiguration;
import com.scottlogic.hackathon.server.models.GameResult;
import com.scottlogic.hackathon.server.models.Team;
import com.scottlogic.hackathon.server.models.Views;
import com.scottlogic.hackathon.server.services.BotService;
import com.scottlogic.hackathon.server.services.GameService;
import com.scottlogic.util.HibernateSessionUtils;

@Path("/game")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class GameResource {
    private final GameService gameService;
    private final BotService botService;
    private final SessionFactory sessionFactory;

    @Inject
    public GameResource(
            GameService gameService,
            BotService botService,
            SessionFactory sessionFactory
    ) {
        this.gameService = gameService;
        this.botService = botService;
        this.sessionFactory = sessionFactory;
    }

    @POST
    @UnitOfWork
    @Timed
    @RolesAllowed(Authorizer.ROLE_ADMIN)
    @JsonView(Views.List.class)
    public GameResult playGame(@Auth final User user, final GameConfiguration gameConfiguration) {
        final Map<Team, Bot> teamBotMap = botService.createTeamBotMap(user, gameConfiguration);
        return gameService.playGame(UUID.randomUUID(), gameConfiguration, teamBotMap);
    }

    @POST
    @UnitOfWork
    @Timed
    @Path("/start")
    @RolesAllowed(Authorizer.ROLE_ADMIN)
    @JsonView(Views.List.class)
    public UUID startGame(@Auth final User user, final GameConfiguration gameConfiguration) {
        final Map<Team, Bot> teamBotMap = botService.createTeamBotMap(user, gameConfiguration);

        var gameId = UUID.randomUUID();

        // Run the game in another thread, so we can just return control to the calling code in case of long-running games
        new Thread(() -> {
            HibernateSessionUtils.request(
                    sessionFactory,
                    () -> gameService.playGame(gameId, gameConfiguration, teamBotMap));
        }).start();

        return gameId;
    }

    @GET
    @UnitOfWork
    @Timed
    @JsonView(Views.List.class)
    public List<GameResult> getGameResults(@QueryParam("hackathonId") Optional<String> hackathonId) {
        if (hackathonId.isPresent()) {
            return gameService.getGameResultsByHackathon(hackathonId.orNull());
        }
        return gameService.getGameResults();
    }

    @GET
    @UnitOfWork
    @Timed
    @Path("/{id}")
    @JsonView(Views.Details.class)
    public GameResult getGameResult(@PathParam("id") final UUID id) {
        return gameService.getGameResult(id);
    }
}
