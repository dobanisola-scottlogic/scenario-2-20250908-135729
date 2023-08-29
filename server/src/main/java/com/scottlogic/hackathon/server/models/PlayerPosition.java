package com.scottlogic.hackathon.server.models;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;

import com.scottlogic.hackathon.game.Id;
import com.scottlogic.hackathon.game.Player;

public class PlayerPosition {
  @JsonIgnore @Getter private Id id;

  @JsonProperty("id")
  @Getter
  private Id playerId;

  @Getter private Position position;

  public PlayerPosition() {}

  public PlayerPosition(final Id id, final Id playerId, final Position position) {
    this.id = id;
    this.playerId = playerId;
    this.position = position;
  }

  public static PlayerPosition create(final Id id, final Player player) {
    return new PlayerPosition(id, player.getId(), Position.create(player.getPosition()));
  }
}
