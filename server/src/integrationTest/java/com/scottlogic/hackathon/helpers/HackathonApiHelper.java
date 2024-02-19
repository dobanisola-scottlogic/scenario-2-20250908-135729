package com.scottlogic.hackathon.helpers;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.ws.rs.client.Entity;
import jakarta.ws.rs.core.Response;
import ru.vyarus.dropwizard.guice.test.ClientSupport;

import com.scottlogic.hackathon.server.models.Hackathon;
import com.scottlogic.hackathon.server.models.Team;

public class HackathonApiHelper {
    private static final BasicAuthHeader AUTH_HEADER = new BasicAuthHeader("admin", "secret");

    private ClientSupport client;
    private ObjectMapper mapper;

    public HackathonApiHelper(ClientSupport client, ObjectMapper mapper) {
        this.client = client;
        this.mapper = mapper;
    }

    public Response postCreateTeam(Team team) {
        try {
            return client.targetRest("team")
                    .request()
                    .header(BasicAuthHeader.KEY, AUTH_HEADER.getHeaderValue())
                    .buildPost(Entity.json(mapper.writeValueAsString(team)))
                    .invoke();
        } catch (JsonProcessingException e) {
            throw new RuntimeException(e);
        }
    }

    public Response getTeams() {
        return client.targetRest("team")
                .request()
                .header(BasicAuthHeader.KEY, AUTH_HEADER.getHeaderValue())
                .buildGet()
                .invoke();
    }

    public Response postCreateHackathon(Hackathon hackathon) throws JsonProcessingException {
        return client.targetRest("hackathon")
                .request()
                .header(BasicAuthHeader.KEY, AUTH_HEADER.getHeaderValue())
                .buildPost(Entity.json(mapper.writeValueAsString(hackathon)))
                .invoke();
    }

}
