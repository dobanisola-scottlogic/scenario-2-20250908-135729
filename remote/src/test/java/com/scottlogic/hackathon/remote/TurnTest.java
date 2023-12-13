package com.scottlogic.hackathon.remote;

import java.util.concurrent.*;
import org.junit.Ignore;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Mock;
import org.mockito.junit.MockitoJUnitRunner;

import com.scottlogic.hackathon.game.GameState;

import static org.junit.Assert.*;

@RunWith(MockitoJUnitRunner.class)
public class TurnTest {

  @Mock GameState gameState;

  @Ignore("HAC-161 Thread state reported inconsistently when running locally vs in CI")
  @Test
  public void testWaitForTurn() throws Exception {
    Turn turn = new Turn();

    Thread waiter =
        new Thread(
            () -> {
              turn.waitForTurn();
              busyForMilliseconds(10);
            });

    
    assertEquals(waiter.getState(), Thread.State.NEW);
    waiter.start();

    assertNotSame(waiter.getState(), Thread.State.NEW);

    ScheduledExecutorService executorService = Executors.newSingleThreadScheduledExecutor();

    CompletableFuture<GameState> future = new CompletableFuture<>();
    executorService.submit(
        () -> {
          future.complete(gameState);
        });

    assertEquals(waiter.getState(), Thread.State.WAITING);
    turn.next(future.get());
    busyForMilliseconds(5);
    assertEquals(waiter.getState(), Thread.State.RUNNABLE);
  }

  public void busyForMilliseconds(int i) {
    for (long stop = System.nanoTime() + TimeUnit.MILLISECONDS.toNanos(i);
        stop > System.nanoTime(); ) {
      /*
       * Hang around long enough to test the thread state
       */
    }
  }
}
