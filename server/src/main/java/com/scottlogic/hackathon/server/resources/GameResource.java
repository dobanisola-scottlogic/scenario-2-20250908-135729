package com.scottlogic.hackathon.server.resources;

import com.codahale.metrics.annotation.Timed;
import com.google.inject.Inject;
import com.scottlogic.hackathon.server.HackathonConfiguration;
import com.scottlogic.hackathon.server.models.GameResult;
import com.scottlogic.hackathon.server.services.GameService;

import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import java.util.List;
import java.util.UUID;

@Path("/game")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class GameResource {
    private final HackathonConfiguration hackathonConfiguration;
    private final GameService gameService;

    @Inject
    public GameResource(final HackathonConfiguration hackathonConfiguration,
                        final GameService gameService) {
        this.hackathonConfiguration = hackathonConfiguration;
        this.gameService = gameService;
    }

    @POST
    @Timed
    public GameResult playGame() {
        // ToDo: Add a parameter with the Game Configuration
        return gameService.playGame();
    }

    @GET
    @Timed
    public List<UUID> getGameResults() {
        return gameService.getGameResults();
    }

    @GET
    @Timed
    @Path("/{id}")
    public GameResult getGameResult(@PathParam("id") final UUID id) {
        return gameService.getGameResult(id);
    }
}
