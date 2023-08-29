package com.scottlogic.hackathon.remote;

import java.util.concurrent.*;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Mock;
import org.powermock.core.classloader.annotations.PrepareForTest;
import org.powermock.modules.junit4.PowerMockRunner;

import com.scottlogic.hackathon.game.GameState;

import static org.junit.Assert.assertTrue;

@RunWith(PowerMockRunner.class)
@PrepareForTest({GameState.class})
public class TurnTest {

  @Mock GameState gameState;

  @Test
  public void testWaitForTurn() throws Exception {
    Turn turn = new Turn();

    Thread waiter =
        new Thread(
            () -> {
              turn.waitForTurn();
              busyForMilliseconds(10);
            });

    assertTrue(waiter.getState() == Thread.State.NEW);
    waiter.start();

    assertTrue(waiter.getState() == Thread.State.RUNNABLE);

    ScheduledExecutorService executorService = Executors.newSingleThreadScheduledExecutor();

    CompletableFuture<GameState> future = new CompletableFuture<>();
    executorService.submit(
        () -> {
          future.complete(gameState);
        });

    assertTrue(waiter.getState() == Thread.State.WAITING);
    turn.next(future.get());
    busyForMilliseconds(5);
    assertTrue(waiter.getState() == Thread.State.RUNNABLE);
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
