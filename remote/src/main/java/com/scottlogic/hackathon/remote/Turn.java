package com.scottlogic.hackathon.remote;

import java.util.concurrent.locks.Condition;
import java.util.concurrent.locks.Lock;
import java.util.concurrent.locks.ReentrantLock;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.scottlogic.hackathon.game.GameState;

public class Turn {

  private static final Logger logger = LoggerFactory.getLogger(Turn.class);

  public Turn() {}

  public GameState getGameState() {
    return gameState;
  }

  private final Lock lock = new ReentrantLock();
  private final Condition turnCondition = lock.newCondition();
  private GameState gameState;

  public void next(GameState gameState) {
    lock.lock();
    try {
      this.gameState = gameState;
      pauseOnInitialise(); // timing issue to investigate further
      turnCondition.signal();
    } finally {
      lock.unlock();
    }
  }

  public void waitForTurn() {
    lock.lock();
    try {
      logger.trace("Thread {}  waitForTurn", Thread.currentThread().getName());
      turnCondition.await();
    } catch (InterruptedException e) {
      Thread.currentThread().interrupt();
    } finally {
      lock.unlock();
    }
  }

  void pauseOnInitialise() {
    if (isInitialise()) {
      try {
        Thread.sleep(100);
      } catch (InterruptedException e) {
        e.printStackTrace();
      }
    }
  }

  public boolean isInitialise() {
    return getGameState().getPlayers().isEmpty();
  }
}
