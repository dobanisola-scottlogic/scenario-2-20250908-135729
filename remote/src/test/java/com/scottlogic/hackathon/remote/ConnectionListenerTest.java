package com.scottlogic.hackathon.remote;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Mock;
import org.mockito.junit.MockitoJUnitRunner;

import com.scottlogic.hackathon.game.Id;
import com.scottlogic.hackathon.game.UniqueIdGenerator;
import com.scottlogic.hackathon.remote.notify.ConnectionChangeEvent;

import static org.mockito.Mockito.*;

@RunWith(MockitoJUnitRunner.class)
public class ConnectionListenerTest {

  @Mock RemoteBotConnector connector;

  @Mock RemoteBotCallback callback;

  @Mock RemoteBot bot;

  @Test
  public void testNewTeamConnect() {
    // Given
    ConnectionListener listener = new ConnectionListener(connector);
    when(connector.getTeam()).thenReturn("team1");
    ConnectionChangeEvent evt = new ConnectionChangeEvent("team1", null, callback);

    // When
    listener.onChangeEvent(evt);

    // Then
    verify(connector, times(1)).connected(callback);
  }

  @Test
  public void testTeamConnectTwice() {
    // Given
    ConnectionListener listener = new ConnectionListener(connector);
    when(connector.getTeam()).thenReturn("team1");
    ConnectionChangeEvent evt = new ConnectionChangeEvent("team1", null, callback);

    // When
    listener.onChangeEvent(evt);

    // Then
    verify(connector, times(1)).connected(callback);
  }

  @Test
  public void testExistingTeamDisconnect() {
    // Given
    ConnectionListener listener = new ConnectionListener(connector);
    when(connector.getTeam()).thenReturn("team1");
    Id id = UniqueIdGenerator.INSTANCE.next();
    when(connector.getId()).thenReturn(id);
    ConnectionChangeEvent disconnectEvt = new ConnectionChangeEvent("team1", callback, null);
    when(callback.getBot()).thenReturn(bot);
    when(bot.getId()).thenReturn(id);

    // When
    listener.onChangeEvent(disconnectEvt);

    // Then
    verify(connector, times(1)).waitForConnect("team1");
  }
}
