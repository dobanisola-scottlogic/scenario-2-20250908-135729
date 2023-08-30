package com.scottlogic.hackathon.remote;

import java.util.concurrent.CompletableFuture;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.powermock.core.classloader.annotations.PrepareForTest;
import org.powermock.modules.junit4.PowerMockRunner;

import com.scottlogic.hackathon.remote.notify.RemoteBotChangeEvent;
import com.scottlogic.hackathon.remote.notify.RemoteBotChangeSupport;
import com.scottlogic.hackathon.remote.server.RemoteBotSocketCreator;
import com.scottlogic.hackathon.remote.server.Sender;

import static com.scottlogic.hackathon.remote.RemoteBotConnector.State.CONNECTED;
import static com.scottlogic.hackathon.remote.RemoteBotConnector.State.WAITING;
import static org.awaitility.Awaitility.await;
import static org.junit.Assert.*;
import static org.mockito.Mockito.*;
import static org.powermock.api.mockito.PowerMockito.whenNew;

@RunWith(PowerMockRunner.class)
@PrepareForTest({
  RemoteBotConnector.class,
  RemoteBotChangeSupport.class,
  RemoteBotCallback.class,
  RemoteBot.class,
  RemoteBotSocketCreator.class,
  Sender.class
})
public class RemoteBotConnectorTest {

  @Mock RemoteBotCallback botCallback;
  @Mock RemoteBot bot;
  @Mock Sender sender;

  @Test
  public void testWaitForConnectAndConnected() throws Exception {
    RemoteBotChangeSupport changeSupport = spy(RemoteBotChangeSupport.class);
    whenNew(RemoteBotChangeSupport.class).withAnyArguments().thenReturn(changeSupport);
    String team = "team1";
    when(bot.getDisplayName()).thenReturn(team);
    when(botCallback.getBot()).thenReturn(bot);
    when(botCallback.getSender()).thenReturn(sender);

    RemoteBotConnector connector = new RemoteBotConnector();

    Thread waiter =
        new Thread(
            () -> {
              connector.waitForConnect(team);
              busyForMilliseconds(100);
            });

    waiter.start();

    await()
        .atMost(250, TimeUnit.MILLISECONDS)
        .until(() -> waiter.getState() == Thread.State.WAITING);

    ScheduledExecutorService executorService = Executors.newSingleThreadScheduledExecutor();
    CompletableFuture<RemoteBotCallback> future = new CompletableFuture<>();
    executorService.submit(
        () -> {
          future.complete(botCallback);
        });

    assertEquals(team, connector.getTeam());
    assertEquals(WAITING, connector.getState());

    connector.connected(future.get());

    await()
        .atMost(250, TimeUnit.MILLISECONDS)
        .until(() -> waiter.getState() != Thread.State.WAITING);

    ArgumentCaptor<RemoteBotChangeEvent> eventArgumentCaptor =
        ArgumentCaptor.forClass(RemoteBotChangeEvent.class);

    assertEquals(team, connector.getTeam());
    assertEquals(CONNECTED, connector.getState());

    verify(changeSupport, times(1)).fireChangeEvent(eventArgumentCaptor.capture());
    assertEquals(eventArgumentCaptor.getValue().getTarget(), team);
    assertEquals(eventArgumentCaptor.getValue().getNewValue().getDisplayName(), team);
    assertNull(eventArgumentCaptor.getValue().getOldValue());

    assertTrue(connector.getRemoteBot().isPresent());
    assertTrue(connector.getRemoteSender().isPresent());
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
