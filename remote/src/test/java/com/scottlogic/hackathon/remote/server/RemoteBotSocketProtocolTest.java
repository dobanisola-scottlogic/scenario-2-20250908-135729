package com.scottlogic.hackathon.remote.server;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.TimeUnit;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.*;
import org.mockito.junit.MockitoJUnitRunner;

import com.scottlogic.hackathon.game.Move;
import com.scottlogic.hackathon.game.UniqueIdGenerator;
import com.scottlogic.hackathon.remote.*;
import com.scottlogic.hackathon.remote.notify.ConnectionChangeEvent;
import com.scottlogic.hackathon.remote.notify.ConnectionChangeSupport;
import com.scottlogic.hackathon.remote.serialization.GameStateBroker;
import com.scottlogic.hackathon.remote.serialization.MakeMovesBroker;
import com.scottlogic.hackathon.remote.serialization.TeamIdBroker;

import static com.scottlogic.hackathon.remote.server.RemoteBotSocketProtocol.State.GAME_OVER;
import static com.scottlogic.hackathon.remote.server.RemoteBotSocketProtocol.State.MAKE_MOVES;
import static java.util.Collections.emptyList;
import static org.junit.Assert.*;
import static org.mockito.Mockito.*;

@RunWith(MockitoJUnitRunner.class)
public class RemoteBotSocketProtocolTest {

  @Mock Turn turn;

  @Mock Sender sender;

  @Mock ConnectionListener listener;

  @Test
  public void testCreateBot() throws Exception {
    var teamIdBroker = mockStatic(TeamIdBroker.class);
    var remoteBot = mockConstruction(
            RemoteBot.class,
            (mock, context) -> when(mock.getDisplayName()).thenReturn("team1")
    );

    try (teamIdBroker; remoteBot) {
      // Given
      ConnectionChangeSupport changeSupport = Mockito.spy(new ConnectionChangeSupport());

      when(listener.isTeam("team1")).thenReturn(true);
      changeSupport.addChangeEventListener(listener);
      RemoteBotSocketProtocol protocol = new RemoteBotSocketProtocol(sender, changeSupport, turn);
      TeamId team = new TeamId("team1", UniqueIdGenerator.INSTANCE.next());

      teamIdBroker.when(() -> TeamIdBroker.deserialize("input")).thenReturn(team);

      ArgumentCaptor<ConnectionChangeEvent> eventArgumentCaptor =
              ArgumentCaptor.forClass(ConnectionChangeEvent.class);

      // When
      protocol.createBot("input");

      // Then
      verify(changeSupport, times(1)).fireChangeEvent(eventArgumentCaptor.capture());
      assertEquals(eventArgumentCaptor.getValue().getTarget(), team.getName());
      assertEquals(
              eventArgumentCaptor.getValue().getNewValue().getBot().getDisplayName(),
              team.getName(),
              team.getName());
      assertNull(eventArgumentCaptor.getValue().getOldValue());
    }
  }

  @Test
  public void testCreateBot_Unexpected() throws Exception {
    var teamBrokerId = mockStatic(TeamIdBroker.class);
    var remoteBot = mockConstruction(RemoteBot.class);

    try (teamBrokerId; remoteBot) {
      // Given
      ConnectionChangeSupport changeSupport = Mockito.spy(new ConnectionChangeSupport());
      RemoteBotSocketProtocol protocol = new RemoteBotSocketProtocol(sender, changeSupport, turn);
      TeamId team = new TeamId("team1", UniqueIdGenerator.INSTANCE.next());

      teamBrokerId.when(() -> TeamIdBroker.deserialize("input")).thenReturn(team);

      // When (no one listening)
      protocol.createBot("input");

      // Then
      verify(sender, times(1)).sendDisconnect();
    }
  }

  @Test
  public void testStartHeartBeat() {
    try (var hb = mockConstruction(HeartBeat.class)) {
      // Given
      long period = 5;
      TimeUnit periodUnit = TimeUnit.SECONDS;
      RemoteBotSocketProtocol protocol =
              new RemoteBotSocketProtocol(sender, Mockito.mock(ConnectionChangeSupport.class), turn);

      // When
      protocol.startHeartBeat(period, periodUnit);

      // Then
      verify(hb.constructed().get(0), times(1)).start();
    }
  }

  @Test
  public void testInitialise() throws Exception {
    try (var gameStateBroker = mockStatic(GameStateBroker.class)) {
      // Given
      String SERIALIZED_GAMESTATE = "Serialized GameState";
      gameStateBroker.when(() -> GameStateBroker.serialize(any())).thenReturn(SERIALIZED_GAMESTATE);
      FakeRemoteBotSocketProtocol protocol =
              new FakeRemoteBotSocketProtocol(sender, mock(ConnectionChangeSupport.class), turn);
      RemoteBot remoteBot = spy(
                      new RemoteBot(new TeamId("team1", UniqueIdGenerator.INSTANCE.next()), turn));
      protocol.setBot(remoteBot);

      // When
      protocol.initialise();

      // Then
      verify(turn, times(1)).waitForTurn();
      verify(remoteBot, times(1)).responseReceived(any());
      verify(sender, times(1)).send(SERIALIZED_GAMESTATE);
    }
  }

  @Test
  public void testSendMakeMoves() throws Exception {
    try (var gameStateBroker = mockStatic(GameStateBroker.class)) {
      // Given
      String SERIALIZED_GAMESTATE = "Serialized GameState";
      gameStateBroker.when(() -> GameStateBroker.serialize(any())).thenReturn(SERIALIZED_GAMESTATE);
      RemoteBotSocketProtocol protocol = spy(
                      new RemoteBotSocketProtocol(sender, Mockito.mock(ConnectionChangeSupport.class), turn));

      // When
      protocol.sendMakeMoves();

      // Then
      verify(turn, times(1)).waitForTurn();
      verify(sender, times(1)).send(SERIALIZED_GAMESTATE);
    }
  }

  @Test
  public void testProcessMakeMoves() throws Exception {
    var makeMovesBroker = mockStatic(MakeMovesBroker.class);
    var gameStateBroker = mockStatic(GameStateBroker.class);

    try (makeMovesBroker; gameStateBroker) {
      List<Move> moves = new ArrayList<>();
      String SERIALIZED_GAMESTATE = "Serialized GameState";

      makeMovesBroker.when(() -> MakeMovesBroker.deserialize(any())).thenReturn(moves);
      gameStateBroker.when(() -> GameStateBroker.serialize(any())).thenReturn(SERIALIZED_GAMESTATE);
      when(turn.isInitialise()).thenReturn(false);
      FakeRemoteBotSocketProtocol protocol = spy(
              new FakeRemoteBotSocketProtocol(
                      sender, mock(ConnectionChangeSupport.class), turn));
      RemoteBot remoteBot = spy(
                      new RemoteBot(new TeamId("team1", UniqueIdGenerator.INSTANCE.next()), turn));
      protocol.setBot(remoteBot);

      // When
      protocol.processMakeMoves("input");

      // Then
      verify(remoteBot, times(1)).responseReceived(moves);
      verify(turn, times(1)).waitForTurn();
      verify(sender, times(1)).send(SERIALIZED_GAMESTATE);
      assertNotSame(protocol.getState(), GAME_OVER);
    }
  }

  @Test
  public void testProcessMakeMovesGameOver() throws Exception {
    var makeMovesBroker = mockStatic(MakeMovesBroker.class);
    var gameStateBroker = mockStatic(GameStateBroker.class);

    try (makeMovesBroker; gameStateBroker) {
      List<Move> moves = new ArrayList<>();
      String GAME_OVER_RESPONSE = GAME_OVER.name();

      makeMovesBroker.when(() -> MakeMovesBroker.deserialize(any())).thenReturn(moves);
      gameStateBroker.when(() -> GameStateBroker.serialize(any())).thenReturn(GAME_OVER_RESPONSE);
      FakeRemoteBotSocketProtocol protocol = spy(
              new FakeRemoteBotSocketProtocol(
                      sender, mock(ConnectionChangeSupport.class), turn));
      RemoteBot remoteBot = spy(
                      new RemoteBot(new TeamId("team1", UniqueIdGenerator.INSTANCE.next()), turn));
      protocol.setBot(remoteBot);
      when(turn.isInitialise()).thenReturn(true);

      // When
      protocol.processMakeMoves("input");

      // Then
      verify(remoteBot, times(1)).responseReceived(moves);
      verify(turn, times(1)).waitForTurn();
      verify(sender, times(1)).send(GAME_OVER_RESPONSE);
      assertSame(protocol.getState(), GAME_OVER);
    }
  }

  @Test
  public void testMakeFirstMove() throws Exception {
    try (var gameStateBroker = mockStatic(GameStateBroker.class)) {
      String SERIALIZED_GAMESTATE = "Serialized GameState";
      gameStateBroker.when(() -> GameStateBroker.serialize(any())).thenReturn(SERIALIZED_GAMESTATE);
      FakeRemoteBotSocketProtocol protocol = spy(
              new FakeRemoteBotSocketProtocol(
                      sender, mock(ConnectionChangeSupport.class), turn));
      RemoteBot remoteBot = spy(
                      new RemoteBot(new TeamId("team1", UniqueIdGenerator.INSTANCE.next()), turn));
      protocol.setBot(remoteBot);

      // When
      protocol.makeFirstMove();

      // Then
      verify(remoteBot, times(1)).responseReceived(emptyList());
      verify(sender, times(2)).send(SERIALIZED_GAMESTATE);
      assertSame(protocol.getState(), MAKE_MOVES);
    }
  }

  static class FakeRemoteBotSocketProtocol extends RemoteBotSocketProtocol {
    public FakeRemoteBotSocketProtocol(
        Sender sender, ConnectionChangeSupport changeSupport, Turn turn) {
      super(sender, changeSupport, turn);
    }

    void setBot(RemoteBot bot) {
      super.bot = bot;
    }
  }
}
