package com.scottlogic.hackathon.server.resources;

import com.codahale.metrics.annotation.Timed;
import com.fasterxml.jackson.annotation.JsonView;
import com.google.common.base.Optional;
import com.google.inject.Inject;
import com.scottlogic.hackathon.game.Bot;
import com.scottlogic.hackathon.server.HackathonConfiguration;
import com.scottlogic.hackathon.server.authentication.Authorizer;
import com.scottlogic.hackathon.server.authentication.User;
import com.scottlogic.hackathon.server.models.GameConfiguration;
import com.scottlogic.hackathon.server.models.GameResult;
import com.scottlogic.hackathon.server.models.Team;
import com.scottlogic.hackathon.server.models.Views;
import com.scottlogic.hackathon.server.services.BotService;
import com.scottlogic.hackathon.server.services.GameService;
import io.dropwizard.auth.Auth;
import io.dropwizard.hibernate.UnitOfWork;

import javax.annotation.security.RolesAllowed;
import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Path("/game")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class GameResource {
    private final HackathonConfiguration hackathonConfiguration;
    private final GameService gameService;
    private final BotService botService;

    @Inject
    public GameResource(final HackathonConfiguration hackathonConfiguration,
                        final GameService gameService,
                        final BotService botService) {
        this.hackathonConfiguration = hackathonConfiguration;
        this.gameService = gameService;
        this.botService = botService;
    }

    @POST
    @UnitOfWork
    @Timed
    @RolesAllowed(Authorizer.ROLE_ADMIN)
    @JsonView(Views.List.class)
    public GameResult playGame(@Auth final User user, final GameConfiguration gameConfiguration) {
        final Map<Team, Bot> teamBotMap = botService.createTeamBotMap(user, gameConfiguration);
        return gameService.playGame(user, gameConfiguration, teamBotMap);
    }

    @GET
    @UnitOfWork
    @Timed
    @JsonView(Views.List.class)
    public List<GameResult> getGameResults(@QueryParam("hackathonId") Optional<UUID> hackathonId) {
        if(hackathonId.isPresent()) {
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
