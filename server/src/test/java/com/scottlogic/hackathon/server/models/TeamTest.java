package com.scottlogic.hackathon.server.models;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.BeforeEach;
import io.dropwizard.auth.basic.BasicCredentials;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.junit.jupiter.api.Assertions.assertFalse;

public class TeamTest {

  private Team team;

  @BeforeEach
  void setUp() {
    team = new Team();
    team.setName("testteam");
    team.setPassword("correct-password123");
  }

  @Test
  void testAuthenticateWithCorrectCredentials() {
    BasicCredentials credentials = new BasicCredentials("testteam", "correct-password123");
    assertTrue(team.authenticate(credentials));
  }

  @Test
  void testAuthenticateWithIncorrectPassword() {
    BasicCredentials credentials = new BasicCredentials("testteam", "wrong-password");
    assertFalse(team.authenticate(credentials));
  }

  @Test
  void testAuthenticateWithIncorrectUsername() {
    BasicCredentials credentials = new BasicCredentials("wrongteam", "correct-password123");
    assertFalse(team.authenticate(credentials));
  }

  @Test
  void testAuthenticateWithNullPassword() {
    team.setPassword(null);
    BasicCredentials credentials = new BasicCredentials("testteam", null);
    assertTrue(team.authenticate(credentials)); // Both null should match
  }

  @Test
  void testAuthenticateWithNullPasswordMismatch() {
    team.setPassword("actual-password");
    BasicCredentials credentials = new BasicCredentials("testteam", null);
    assertFalse(team.authenticate(credentials));
  }

  @Test
  void testConstantTimeComparison() {
    // This test verifies that different length passwords are handled correctly
    team.setPassword("short");
    BasicCredentials credentials = new BasicCredentials("testteam", "verylongpasswordthatdoesnotmatch");
    assertFalse(team.authenticate(credentials));
  }
}