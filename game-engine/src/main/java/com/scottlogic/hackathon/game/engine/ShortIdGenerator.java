package com.scottlogic.hackathon.game.engine;

import java.util.concurrent.atomic.AtomicLong;

import com.scottlogic.hackathon.game.Id;

public class ShortIdGenerator {

  AtomicLong lastId = new AtomicLong();

  public Id next() {
    return new Id(lastId.incrementAndGet());
  }
}
