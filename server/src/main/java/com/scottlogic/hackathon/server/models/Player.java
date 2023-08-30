package com.scottlogic.hackathon.server.models;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import com.scottlogic.hackathon.game.Id;

@NoArgsConstructor
@AllArgsConstructor
public class Player {
  @Getter private Id id;
  @Getter private Id owner;

  public static Player create(final com.scottlogic.hackathon.game.Player player) {
    return new Player(player.getId(), player.getOwner());
  }
}
