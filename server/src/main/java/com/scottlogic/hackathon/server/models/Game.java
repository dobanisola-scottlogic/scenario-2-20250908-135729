package com.scottlogic.hackathon.server.models;

import java.util.Set;
import com.fasterxml.jackson.annotation.JsonView;

public class Game {
  @JsonView(Views.List.class)
  private Long gameTime;

  @JsonView(Views.List.class)
  private Set<GameTeam> teams;

  @JsonView(Views.List.class)
  private ArenaModel arena;

  private String hackathonId;

  public Game() {}

  public Game(final Set<GameTeam> teams, final ArenaModel arena, final String hackathonId) {
    this.gameTime = System.currentTimeMillis();
    this.teams = teams;
    this.arena = arena;
    this.hackathonId = hackathonId;
  }

  public Set<GameTeam> getTeams() {
    return teams;
  }

  public ArenaModel getMap() {
    return arena;
  }

  public String getHackathonId() {
    return hackathonId;
  }
}
