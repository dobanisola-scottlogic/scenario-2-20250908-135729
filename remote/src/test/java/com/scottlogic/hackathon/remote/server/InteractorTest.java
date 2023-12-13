package com.scottlogic.hackathon.remote.server;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.junit.MockitoJUnitRunner;

import com.scottlogic.hackathon.remote.Turn;
import com.scottlogic.hackathon.remote.notify.ConnectionChangeSupport;

import static org.mockito.Mockito.*;

@RunWith(MockitoJUnitRunner.class)
public class InteractorTest {

  @Test
  public void testReceive() {
    var protocol = mockConstruction(
        RemoteBotSocketProtocol.class,
        (mock, context) -> doNothing().when(mock).receive(any())
    );

    try (protocol) {
      Interactor interactor = new Interactor(new ConnectionChangeSupport(), new Turn());
      String message = "input";

      interactor.receive(message);

      verify(protocol.constructed().get(0), times(1)).receive(message);
    }
  }

  @Test
  public void testSend() throws Exception {
    var adapter = mockConstruction(RemoteBotSocketAdapter.class, (mock, context) -> doNothing().when(mock).send(any()));

    try (adapter) {
      Interactor interactor = new Interactor(new ConnectionChangeSupport(), new Turn());
      String message = "input";

      interactor.send(message);

      verify(adapter.constructed().get(0), times(1)).send(message);
    }
  }

  @Test
  public void testSendDisconnect() {
    var protocol = mockConstruction(
        RemoteBotSocketProtocol.class,
        (mock, context) -> doNothing().when(mock).cancelHeartBeat()
    );
    var adapter = mockConstruction(RemoteBotSocketAdapter.class, (mock, context) -> doNothing().when(mock).close());

    try (protocol; adapter) {
      Interactor interactor = new Interactor(new ConnectionChangeSupport(), new Turn());

      interactor.sendDisconnect();

      verify(adapter.constructed().get(0), times(1)).close();
      verify(protocol.constructed().get(0), times(1)).cancelHeartBeat();
    }
  }

  @Test
  public void testSendPing_Failure() {
    var protocol = mockConstruction(RemoteBotSocketProtocol.class, (mock, context) -> {
      doNothing().when(mock).cancelHeartBeat();
      doNothing().when(mock).notifyBotDisconnected();
    });
    var adapter = mockConstruction(RemoteBotSocketAdapter.class, (mock, context) -> when(mock.sendPing()).thenReturn(false));

    try (protocol; adapter) {
      Interactor interactor = new Interactor(new ConnectionChangeSupport(), new Turn());

      interactor.sendPing();

      verify(adapter.constructed().get(0), times(1)).sendPing();
      verify(protocol.constructed().get(0), times(1)).cancelHeartBeat();
      verify(protocol.constructed().get(0), times(1)).notifyBotDisconnected();
    }
  }
}
