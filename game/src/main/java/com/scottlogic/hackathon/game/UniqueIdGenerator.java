package com.scottlogic.hackathon.game;

import java.util.concurrent.atomic.AtomicLong;

public enum UniqueIdGenerator {
  INSTANCE;

  AtomicLong lastId = new AtomicLong(System.currentTimeMillis());

  public Id next() {
    return (new Id(lastId.getAndIncrement()));
  }

  public void setSeed(long start) {
    lastId.set(start);
  }
}
