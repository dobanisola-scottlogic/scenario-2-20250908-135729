package com.scottlogic.hackathon.server;

import org.junit.Test;

import static org.junit.Assert.assertNotNull;

public class HackathonApplicationTest {
  @Test
  public void testHackathonApplication() {
    HackathonApplication application = new HackathonApplication();

    assertNotNull(application);
  }
}
