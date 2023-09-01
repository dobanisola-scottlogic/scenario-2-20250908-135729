package com.scottlogic.hackathon.remote;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Mock;
import org.powermock.core.classloader.annotations.PrepareForTest;
import org.powermock.modules.junit4.PowerMockRunner;

import com.scottlogic.hackathon.game.Id;
import com.scottlogic.hackathon.game.UniqueIdGenerator;
import com.scottlogic.hackathon.remote.notify.ConnectionChangeEvent;
import com.scottlogic.hackathon.remote.server.Sender;

import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.powermock.api.mockito.PowerMockito.when;

@RunWith(PowerMockRunner.class)
@PrepareForTest({RemoteBotConnector.class, RemoteBotCallback.class, Sender.class, RemoteBot.class})
public class ConnectionListenerTest {

  @Mock RemoteBotConnector connector;

  @Mock RemoteBotCallback callback;

  @Mock RemoteBot bot;

  @Mock Sender sender;

  @Test
  public void testNewTeamConnect() throws Exception {
    // Given
    ConnectionListener listener = new ConnectionListener(connector);
    when(connector.getTeam()).thenReturn("team1");
    when(connector.getState()).thenReturn(RemoteBotConnector.State.WAITING);
    ConnectionChangeEvent evt = new ConnectionChangeEvent("team1", null, callback);

    // When
    listener.onChangeEvent(evt);

    // Then
    verify(connector, times(1)).connected(callback);
  }

  @Test
  public void testTeamConnectTwice() throws Exception {
    // Given
    ConnectionListener listener = new ConnectionListener(connector);
    when(connector.getTeam()).thenReturn("team1");
    when(connector.getState()).thenReturn(RemoteBotConnector.State.CONNECTED);
    ConnectionChangeEvent evt = new ConnectionChangeEvent("team1", null, callback);
    when(callback.getSender()).thenReturn(sender);

    // When
    listener.onChangeEvent(evt);

    // Then
    verify(connector, times(1)).connected(callback);
  }

  @Test
  public void testExistingTeamDisconnect() throws Exception {
    // Given
    ConnectionListener listener = new ConnectionListener(connector);
    when(connector.getTeam()).thenReturn("team1");
    when(connector.getState()).thenReturn(RemoteBotConnector.State.CONNECTED);
    Id id = UniqueIdGenerator.INSTANCE.next();
    when(connector.getId()).thenReturn(id);
    ConnectionChangeEvent disconnectEvt = new ConnectionChangeEvent("team1", callback, null);
    when(callback.getSender()).thenReturn(sender);
    when(callback.getBot()).thenReturn(bot);
    when(bot.getId()).thenReturn(id);

    // When
    listener.onChangeEvent(disconnectEvt);

    // Then
    verify(connector, times(1)).waitForConnect("team1");
  }
}
