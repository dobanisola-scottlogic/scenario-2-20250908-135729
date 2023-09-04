package com.scottlogic.hackathon.server.models;

import com.fasterxml.jackson.annotation.JsonView;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import com.scottlogic.hackathon.game.Id;

@NoArgsConstructor
@AllArgsConstructor
public class SpawnPoint {
  @JsonView(Views.List.class)
  @Getter
  private Id id;

  @JsonView(Views.List.class)
  @Getter
  private Id owner;

  @JsonView(Views.Details.class)
  @Getter
  private Position position;

  public static SpawnPoint create(final com.scottlogic.hackathon.game.SpawnPoint spawnPoint) {
    return new SpawnPoint(
        spawnPoint.getId(), spawnPoint.getOwner(), Position.create(spawnPoint.getPosition()));
  }
}
