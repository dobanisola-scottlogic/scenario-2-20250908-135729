package com.scottlogic.hackathon.server.models;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;

public class HackathonTest {
  private static final String NAME = "Hackathon name";

  @Test
  public void createWithNameTest() {
    Hackathon hackathon = new Hackathon(NAME);

    assertEquals("hackathon-name", hackathon.getId());
    assertEquals(NAME, hackathon.getName());
    assertEquals("com.scottlogic.hackathon.bots.Milestone1Bot", hackathon.getCurrentMilestoneClassName());
    assertEquals("Easy", hackathon.getCurrentMilestoneMap());
  }

  @Test
  public void createWithLeadingTrailingSpacesTest() {
    Hackathon hackathon  = new Hackathon("  " + NAME + "  ");

    assertEquals(NAME, hackathon.getName());
  }

  @Test
  public void createWithMultipleSpacesTest() {
    Hackathon hackathon  = new Hackathon(NAME + "  " + NAME);

    assertEquals(NAME + " " + NAME, hackathon.getName());
  }

  @Test
  public void setNameTest() {
    Hackathon hackathon = new Hackathon();

    hackathon.setName(NAME);

    assertEquals(NAME, hackathon.getName());
    assertEquals("hackathon-name", hackathon.getId());
  }

  @Test
  public void setNameWithLeadingTrailingSpacesTest() {
    Hackathon hackathon = new Hackathon();

    hackathon.setName("  " + NAME + "  ");

    assertEquals(NAME, hackathon.getName());
    assertEquals("hackathon-name", hackathon.getId());
  }

  @Test
  public void setNameWithMultipleSpacesTest() {
    Hackathon hackathon = new Hackathon();

    hackathon.setName(NAME + "  " + NAME);

    assertEquals(NAME + " " + NAME, hackathon.getName());
    assertEquals("hackathon-name-hackathon-name", hackathon.getId());
  }

}
