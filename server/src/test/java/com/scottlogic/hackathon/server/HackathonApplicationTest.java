package com.scottlogic.hackathon.server;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertNotNull;

public class HackathonApplicationTest {
  @Test
  public void testHackathonApplication() {
    HackathonApplication application = new HackathonApplication();

    assertNotNull(application);
  }
}
