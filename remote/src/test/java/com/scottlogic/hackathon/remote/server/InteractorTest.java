package com.scottlogic.hackathon.remote.server;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Mock;
import org.powermock.api.mockito.PowerMockito;
import org.powermock.core.classloader.annotations.PrepareForTest;
import org.powermock.modules.junit4.PowerMockRunner;

import com.scottlogic.hackathon.remote.Turn;
import com.scottlogic.hackathon.remote.notify.ConnectionChangeSupport;

import static org.mockito.Mockito.*;

@RunWith(PowerMockRunner.class)
@PrepareForTest({Interactor.class, RemoteBotSocketProtocol.class, RemoteBotSocketAdapter.class})
public class InteractorTest {
  @Mock private RemoteBotSocketProtocol protocol;

  @Mock private RemoteBotSocketAdapter adapter;

  @Test
  public void testReceive() throws Exception {
    PowerMockito.whenNew(RemoteBotSocketProtocol.class).withAnyArguments().thenReturn(protocol);
    Interactor interactor = new Interactor(new ConnectionChangeSupport(), new Turn());
    String message = "input";
    doNothing().when(protocol).receive(any());

    interactor.receive(message);

    verify(protocol, times(1)).receive(message);
  }

  @Test
  public void testSend() throws Exception {
    PowerMockito.whenNew(RemoteBotSocketAdapter.class).withAnyArguments().thenReturn(adapter);
    Interactor interactor = new Interactor(new ConnectionChangeSupport(), new Turn());
    String message = "input";
    doNothing().when(adapter).send(any());

    interactor.send(message);

    verify(adapter, times(1)).send(message);
  }

  @Test
  public void testSendDisconnect() throws Exception {
    PowerMockito.whenNew(RemoteBotSocketProtocol.class).withAnyArguments().thenReturn(protocol);
    PowerMockito.whenNew(RemoteBotSocketAdapter.class).withAnyArguments().thenReturn(adapter);
    Interactor interactor = new Interactor(new ConnectionChangeSupport(), new Turn());

    doNothing().when(adapter).close();
    doNothing().when(protocol).cancelHeartBeat();
    interactor.sendDisconnect();

    verify(adapter, times(1)).close();
    verify(protocol, times(1)).cancelHeartBeat();
  }

  @Test
  public void testSendPing_Failure() throws Exception {
    PowerMockito.whenNew(RemoteBotSocketProtocol.class).withAnyArguments().thenReturn(protocol);
    PowerMockito.whenNew(RemoteBotSocketAdapter.class).withAnyArguments().thenReturn(adapter);
    Interactor interactor = new Interactor(new ConnectionChangeSupport(), new Turn());

    when(adapter.sendPing()).thenReturn(false);
    doNothing().when(protocol).cancelHeartBeat();
    doNothing().when(protocol).notifyBotDisconnected();

    interactor.sendPing();

    verify(adapter, times(1)).sendPing();
    verify(protocol, times(1)).cancelHeartBeat();
    verify(protocol, times(1)).notifyBotDisconnected();
  }
}
