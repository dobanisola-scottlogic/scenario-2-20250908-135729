package com.scottlogic.hackathon.game;

import lombok.Value;

@Value
public class MoveImpl implements Move {
  Id player;
  Direction direction;
}
