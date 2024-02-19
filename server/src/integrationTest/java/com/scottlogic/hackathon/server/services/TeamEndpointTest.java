package com.scottlogic.hackathon.server.services;

import java.util.List;
import java.util.Map;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.ws.rs.core.Response;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import ru.vyarus.dropwizard.guice.test.ClientSupport;
import ru.vyarus.dropwizard.guice.test.jupiter.TestDropwizardApp;

import com.scottlogic.hackathon.helpers.HackathonApiHelper;
import com.scottlogic.hackathon.server.HackathonApplication;
import com.scottlogic.hackathon.server.models.Hackathon;
import com.scottlogic.hackathon.server.models.Team;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;

@SuppressWarnings("unchecked")

@TestDropwizardApp(value = HackathonApplication.class, randomPorts = true, config = "server.yml")
public class TeamEndpointTest {
    private static final String EXISTING_HACKATHON_ID = "testhackathon";

    private static HackathonApiHelper api = null;

    @BeforeAll
    static void setUp(ClientSupport client, ObjectMapper mapper) throws JsonProcessingException {
        api = new HackathonApiHelper(client, mapper);
        Hackathon hackathon = new Hackathon(EXISTING_HACKATHON_ID);

        Response response = api.postCreateHackathon(hackathon);

        assertEquals(201, response.getStatus());

    }

    @Test
    void givenNoTeamsAddedWhenGetTeamThenEmptyListReturned() {
        Response response = api.getTeams();

        assertEquals(200, response.getStatus());
        List<Team> entity = response.readEntity(List.class);

        assertEquals(0, entity.size());
    }

    @Test
    void givenTeamHackathonIdExistsWhenAddTeamThenListWithTeamReturned(ObjectMapper mapper)
            throws JsonProcessingException {
        Team team = new Team();
        team.setName("testteam");
        team.setPassword("Hunter2");
        team.setHackathonId(EXISTING_HACKATHON_ID);

        Response response = api.postCreateTeam(team);

        assertEquals(200, response.getStatus());

        response = api.getTeams();

        assertEquals(200, response.getStatus());
        List<Map<String, String>> teamList = response.readEntity(List.class);

        assertEquals(1, teamList.size());
        String teamStr = mapper.writeValueAsString(teamList.get(0));
        Team returnedTeam = mapper.readValue(teamStr, Team.class);

        assertEquals("testteam", returnedTeam.getName());
        assertEquals("testhackathon", returnedTeam.getHackathonId());
        assertEquals("Hunter2", returnedTeam.getPassword());
        assertNotNull(returnedTeam.getId());
    }

    @Test
    void givenTeamHackathonIdDoesNotExistWhenAddTeamThenErrorReturned() {
        Team team = new Team();
        team.setName("testteam");
        team.setPassword("Hunter2");
        team.setHackathonId("non-existent-hackathon");

        Response response = api.postCreateTeam(team);

        assertEquals(400, response.getStatus());
        assertTrue(response.readEntity(String.class).contains("Hackathon with ID 'non-existent-hackathon' not found"));
    }
}
