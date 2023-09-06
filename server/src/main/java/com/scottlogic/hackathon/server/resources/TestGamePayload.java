package com.scottlogic.hackathon.server.resources;

import lombok.Getter;
import lombok.NoArgsConstructor;

@NoArgsConstructor
public class TestGamePayload {

  @Getter private String teamName;

  @Getter private String milestone;

  @Getter private String map;
}
