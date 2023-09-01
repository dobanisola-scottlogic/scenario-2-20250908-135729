package com.scottlogic.hackathon.remote;

import java.util.Collections;
import java.util.List;
import java.util.concurrent.TimeUnit;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Mock;
import org.powermock.core.classloader.annotations.PrepareForTest;
import org.powermock.modules.junit4.PowerMockRunner;

import com.scottlogic.hackathon.game.GameState;
import com.scottlogic.hackathon.game.Move;
import com.scottlogic.hackathon.remote.serialization.MakeMovesFixture;
import com.scottlogic.hackathon.remote.serialization.TeamIdFixture;

import static org.awaitility.Awaitility.await;
import static org.hamcrest.Matchers.is;
import static org.junit.Assert.assertThat;

@RunWith(PowerMockRunner.class)
@PrepareForTest({RemoteBot.class, Turn.class, GameState.class})
public class RemoteBotTest {

  @Mock Turn turn;

  @Mock GameState gameState;

  @Test
  public void testInitialise() {
    TeamIdFixture fixture = new TeamIdFixture();

    RemoteBot bot = new RemoteBot(fixture.teamId, turn);

    Thread waiter =
        new Thread(
            () -> {
              bot.initialise(gameState);
              busyForMilliseconds(100);
            });

    waiter.start();

    // blocking
    await()
        .atMost(250, TimeUnit.MILLISECONDS)
        .until(() -> waiter.getState() == Thread.State.WAITING);

    bot.responseReceived(Collections.emptyList());

    // not blocking
    await()
        .atMost(250, TimeUnit.MILLISECONDS)
        .until(() -> waiter.getState() != Thread.State.WAITING);
  }

  @Test
  public void testMakeMoves() {
    TeamIdFixture teamIdFixture = new TeamIdFixture();
    MakeMovesFixture movesFixture = new MakeMovesFixture();

    RemoteBot bot = new RemoteBot(teamIdFixture.teamId, turn);

    Thread waiter =
        new Thread(
            () -> {
              List<Move> moves = bot.makeMoves(gameState);
              assertThat(moves, is(movesFixture.moves));
              busyForMilliseconds(100);
            });

    waiter.start();

    // blocking
    await()
        .atMost(250, TimeUnit.MILLISECONDS)
        .until(() -> waiter.getState() == Thread.State.WAITING);

    bot.responseReceived(movesFixture.moves);

    // not blocking
    await()
        .atMost(250, TimeUnit.MILLISECONDS)
        .until(() -> waiter.getState() != Thread.State.WAITING);
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
