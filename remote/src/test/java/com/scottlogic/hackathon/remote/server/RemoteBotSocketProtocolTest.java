package com.scottlogic.hackathon.remote.server;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.TimeUnit;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.*;
import org.powermock.api.mockito.PowerMockito;
import org.powermock.core.classloader.annotations.PrepareForTest;
import org.powermock.modules.junit4.PowerMockRunner;

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
import static org.powermock.api.mockito.PowerMockito.*;

@RunWith(PowerMockRunner.class)
@PrepareForTest({
  HeartBeat.class,
  Sender.class,
  GameStateBroker.class,
  MakeMovesBroker.class,
  TeamIdBroker.class,
  RemoteBot.class,
  RemoteBotSocketProtocol.class,
  ConnectionListener.class
})
public class RemoteBotSocketProtocolTest {

  @Mock Turn turn;

  @Mock Sender sender;

  @Mock HeartBeat hb;

  @Mock ConnectionListener listener;

  @Test
  public void testCreateBot() throws Exception {
    // Given
    ConnectionChangeSupport changeSupport = Mockito.spy(new ConnectionChangeSupport());

    PowerMockito.when(listener.isTeam("team1")).thenReturn(true);
    changeSupport.addChangeEventListener(listener);
    RemoteBotSocketProtocol protocol = new RemoteBotSocketProtocol(sender, changeSupport, turn);
    TeamId team = new TeamId("team1", UniqueIdGenerator.INSTANCE.next());
    RemoteBot remoteBot = new RemoteBot(team, turn);

    PowerMockito.mockStatic(TeamIdBroker.class);
    PowerMockito.when(TeamIdBroker.deserialize("input")).thenReturn(team);
    whenNew(RemoteBot.class).withAnyArguments().thenReturn(remoteBot);

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

  @Test
  public void testCreateBot_Unexpected() throws Exception {
    // Given
    ConnectionChangeSupport changeSupport = Mockito.spy(new ConnectionChangeSupport());
    RemoteBotSocketProtocol protocol = new RemoteBotSocketProtocol(sender, changeSupport, turn);
    TeamId team = new TeamId("team1", UniqueIdGenerator.INSTANCE.next());
    RemoteBot remoteBot = new RemoteBot(team, turn);

    PowerMockito.mockStatic(TeamIdBroker.class);
    PowerMockito.when(TeamIdBroker.deserialize("input")).thenReturn(team);
    whenNew(RemoteBot.class).withAnyArguments().thenReturn(remoteBot);

    // When (no one listening)
    protocol.createBot("input");

    // Then
    verify(sender, times(1)).sendDisconnect();
  }

  @Test
  public void testStartHeartBeat() throws Exception {
    // Given
    long period = 5;
    TimeUnit periodUnit = TimeUnit.SECONDS;
    RemoteBotSocketProtocol protocol =
        new RemoteBotSocketProtocol(sender, Mockito.mock(ConnectionChangeSupport.class), turn);
    PowerMockito.whenNew(HeartBeat.class).withAnyArguments().thenReturn(hb);

    // When
    protocol.startHeartBeat(period, periodUnit);

    // Then
    verify(hb, times(1)).start();
  }

  @Test
  public void testInitialise() throws Exception {
    // Given
    String SERIALIZED_GAMESTATE = "Serialized GameState";
    PowerMockito.mockStatic(GameStateBroker.class);
    PowerMockito.when(GameStateBroker.serialize(any())).thenReturn(SERIALIZED_GAMESTATE);
    FakeRemoteBotSocketProtocol protocol =
        new FakeRemoteBotSocketProtocol(sender, Mockito.mock(ConnectionChangeSupport.class), turn);
    RemoteBot remoteBot =
        PowerMockito.spy(
            new RemoteBot(new TeamId("team1", UniqueIdGenerator.INSTANCE.next()), turn));
    protocol.setBot(remoteBot);

    // When
    protocol.initialise();

    // Then
    verify(turn, times(1)).waitForTurn();
    verify(remoteBot, times(1)).responseReceived(any());
    verify(sender, times(1)).send(SERIALIZED_GAMESTATE);
  }

  @Test
  public void testSendMakeMoves() throws Exception {
    // Given
    String SERIALIZED_GAMESTATE = "Serialized GameState";
    PowerMockito.mockStatic(GameStateBroker.class);
    PowerMockito.when(GameStateBroker.serialize(any())).thenReturn(SERIALIZED_GAMESTATE);
    RemoteBotSocketProtocol protocol =
        PowerMockito.spy(
            new RemoteBotSocketProtocol(sender, Mockito.mock(ConnectionChangeSupport.class), turn));

    // When
    protocol.sendMakeMoves();

    // Then
    verify(turn, times(1)).waitForTurn();
    verify(sender, times(1)).send(SERIALIZED_GAMESTATE);
  }

  @Test
  public void testProcessMakeMoves() throws Exception {
    List<Move> moves = new ArrayList<>();
    String SERIALIZED_GAMESTATE = "Serialized GameState";

    PowerMockito.mockStatic(MakeMovesBroker.class);
    PowerMockito.when(MakeMovesBroker.deserialize(any())).thenReturn(moves);
    PowerMockito.mockStatic(GameStateBroker.class);
    PowerMockito.when(GameStateBroker.serialize(any())).thenReturn(SERIALIZED_GAMESTATE);
    PowerMockito.when(turn.isInitialise()).thenReturn(false);
    FakeRemoteBotSocketProtocol protocol =
        PowerMockito.spy(
            new FakeRemoteBotSocketProtocol(
                sender, Mockito.mock(ConnectionChangeSupport.class), turn));
    RemoteBot remoteBot =
        PowerMockito.spy(
            new RemoteBot(new TeamId("team1", UniqueIdGenerator.INSTANCE.next()), turn));
    protocol.setBot(remoteBot);

    // When
    protocol.processMakeMoves("input");

    // Then
    verify(remoteBot, times(1)).responseReceived(moves);
    verify(turn, times(1)).waitForTurn();
    verify(sender, times(1)).send(SERIALIZED_GAMESTATE);
    assertFalse(protocol.getState() == GAME_OVER);
  }

  @Test
  public void testProcessMakeMovesGameOver() throws Exception {
    List<Move> moves = new ArrayList<>();
    String GAME_OVER_RESPONSE = GAME_OVER.name();

    PowerMockito.mockStatic(MakeMovesBroker.class);
    PowerMockito.when(MakeMovesBroker.deserialize(any())).thenReturn(moves);
    PowerMockito.mockStatic(GameStateBroker.class);
    PowerMockito.when(GameStateBroker.serialize(any())).thenReturn(GAME_OVER_RESPONSE);
    FakeRemoteBotSocketProtocol protocol =
        PowerMockito.spy(
            new FakeRemoteBotSocketProtocol(
                sender, Mockito.mock(ConnectionChangeSupport.class), turn));
    RemoteBot remoteBot =
        PowerMockito.spy(
            new RemoteBot(new TeamId("team1", UniqueIdGenerator.INSTANCE.next()), turn));
    protocol.setBot(remoteBot);
    PowerMockito.when(turn.isInitialise()).thenReturn(true);

    // When
    protocol.processMakeMoves("input");

    // Then
    verify(remoteBot, times(1)).responseReceived(moves);
    verify(turn, times(1)).waitForTurn();
    verify(sender, times(1)).send(GAME_OVER_RESPONSE);
    assertTrue(protocol.getState() == GAME_OVER);
  }

  @Test
  public void testMakeFirstMove() throws Exception {
    String SERIALIZED_GAMESTATE = "Serialized GameState";
    PowerMockito.mockStatic(GameStateBroker.class);
    PowerMockito.when(GameStateBroker.serialize(any())).thenReturn(SERIALIZED_GAMESTATE);
    FakeRemoteBotSocketProtocol protocol =
        PowerMockito.spy(
            new FakeRemoteBotSocketProtocol(
                sender, Mockito.mock(ConnectionChangeSupport.class), turn));
    RemoteBot remoteBot =
        PowerMockito.spy(
            new RemoteBot(new TeamId("team1", UniqueIdGenerator.INSTANCE.next()), turn));
    protocol.setBot(remoteBot);
    PowerMockito.when(turn.isInitialise()).thenReturn(true);

    // When
    protocol.makeFirstMove();

    // Then
    verify(remoteBot, times(1)).responseReceived(emptyList());
    verify(sender, times(2)).send(SERIALIZED_GAMESTATE);
    assertTrue(protocol.getState() == MAKE_MOVES);
  }

  class FakeRemoteBotSocketProtocol extends RemoteBotSocketProtocol {
    public FakeRemoteBotSocketProtocol(
        Sender sender, ConnectionChangeSupport changeSupport, Turn turn) {
      super(sender, changeSupport, turn);
    }

    void setBot(RemoteBot bot) {
      super.bot = bot;
    }
  }
}
