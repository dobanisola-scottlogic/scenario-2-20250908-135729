package com.scottlogic.hackathon.remote;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.atomic.AtomicReference;
import java.util.concurrent.locks.Condition;
import java.util.concurrent.locks.Lock;
import java.util.concurrent.locks.ReentrantLock;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.scottlogic.hackathon.game.Bot;
import com.scottlogic.hackathon.game.GameState;
import com.scottlogic.hackathon.game.Move;

/**
 * The RemoteBot is an extension of {@linkplain Bot} that delegates {@link #initialise(GameState)}
 * and {@link #makeMoves(GameState)} to a {@linkplain RemoteBotProtocol} internally it uses a lock
 * and condition to block while waiting for a response from the {@linkplain RemoteBotProtocol}.
 */
public class RemoteBot extends Bot {
  private final Lock lock = new ReentrantLock();
  private final Condition responseCondition = lock.newCondition();
  private Turn turn;
  private AtomicReference<List<Move>> moves = new AtomicReference<>(new ArrayList<>());
  private static final Logger logger = LoggerFactory.getLogger(RemoteBot.class);

  public RemoteBot(TeamId teamId, Turn turn) {
    super(teamId.getId(), teamId.getName());
    this.turn = turn;
  }

  @Override
  public void initialise(final GameState initialGameState) {
    waitForResponse(initialGameState);
  }

  @Override
  public List<Move> makeMoves(GameState gameState) {
    return waitForResponse(gameState);
  }

  private List<Move> waitForResponse(GameState gameState) {
    lock.lock();
    try {
      logger.trace("Thread {}  waitForResponse", Thread.currentThread().getName());
      turn.next(gameState);
      responseCondition.await();
    } catch (InterruptedException e) {
      Thread.currentThread().interrupt();
    } finally {
      lock.unlock();
    }
    return moves.get();
  }

  public void responseReceived(List<Move> moves) {
    lock.lock();
    try {
      logger.trace("Thread {}  responseReceived", Thread.currentThread().getName());
      this.moves.getAndSet(new ArrayList<>(moves));
      responseCondition.signal();
    } finally {
      lock.unlock();
    }
  }
}
