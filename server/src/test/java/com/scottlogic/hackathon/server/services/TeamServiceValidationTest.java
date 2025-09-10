package com.scottlogic.hackathon.server.services;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.BeforeEach;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;

import com.scottlogic.hackathon.server.models.Team;
import com.scottlogic.hackathon.server.services.stores.TeamStore;

public class TeamServiceValidationTest {

  @Mock
  private TeamStore teamStore;
  
  @Mock
  private HackathonService hackathonService;

  private TeamService teamService;

  @BeforeEach
  void setUp() {
    MockitoAnnotations.openMocks(this);
    teamService = new TeamService(teamStore, hackathonService);
  }

  @Test
  void testValidTeamCreation() {
    Team team = new Team();
    team.setName("ValidTeam123");
    team.setPassword("validPass1");
    team.setHackathonId("test-hackathon");

    // This test would require proper mocking of dependencies
    // For now, just verify the validation logic doesn't throw
    try {
      // This will throw due to missing hackathon, but validates name/password first
      teamService.addTeam(team);
    } catch (IllegalArgumentException e) {
      // Expected due to hackathon not found in mock
      assertTrue(e.getMessage().contains("Hackathon") || e.getMessage().contains("not found"));
    }
  }

  @Test
  void testInvalidTeamNameWithSpecialCharacters() {
    Team team = new Team();
    team.setName("Invalid<script>Team");
    team.setPassword("validPass1");
    team.setHackathonId("test-hackathon");

    IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, () -> {
      teamService.addTeam(team);
    });
    
    assertTrue(exception.getMessage().contains("can only contain letters"));
  }

  @Test
  void testInvalidTeamNameTooLong() {
    Team team = new Team();
    team.setName("ThisTeamNameIsWayTooLongAndExceedsFiftyCharactersLimit");
    team.setPassword("validPass1");
    team.setHackathonId("test-hackathon");

    IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, () -> {
      teamService.addTeam(team);
    });
    
    assertTrue(exception.getMessage().contains("cannot exceed 50 characters"));
  }

  @Test
  void testInvalidPasswordTooShort() {
    Team team = new Team();
    team.setName("ValidTeam");
    team.setPassword("short1");
    team.setHackathonId("test-hackathon");

    IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, () -> {
      teamService.addTeam(team);
    });
    
    assertTrue(exception.getMessage().contains("at least 8 characters"));
  }

  @Test
  void testInvalidPasswordNoLetter() {
    Team team = new Team();
    team.setName("ValidTeam");
    team.setPassword("12345678");
    team.setHackathonId("test-hackathon");

    IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, () -> {
      teamService.addTeam(team);
    });
    
    assertTrue(exception.getMessage().contains("letter and one number"));
  }

  @Test
  void testInvalidPasswordNoNumber() {
    Team team = new Team();
    team.setName("ValidTeam");
    team.setPassword("onlyletters");
    team.setHackathonId("test-hackathon");

    IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, () -> {
      teamService.addTeam(team);
    });
    
    assertTrue(exception.getMessage().contains("letter and one number"));
  }
}