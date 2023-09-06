package com.scottlogic.hackathon.server.models;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import com.scottlogic.hackathon.game.Id;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class DisqualifiedBot {
  private Id id;
  private String reason;
}
