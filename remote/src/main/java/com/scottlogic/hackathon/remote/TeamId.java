package com.scottlogic.hackathon.remote;

import lombok.Value;

import com.scottlogic.hackathon.game.Id;

@Value
public class TeamId {

  private String name;
  private Id id;
}
