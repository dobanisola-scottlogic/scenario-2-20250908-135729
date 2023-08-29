package com.scottlogic.hackathon.remote.client;

import java.io.IOException;
import java.util.List;
import org.eclipse.jetty.websocket.api.RemoteEndpoint;
import org.eclipse.jetty.websocket.api.Session;
import org.eclipse.jetty.websocket.api.UpgradeResponse;
import org.eclipse.jetty.websocket.client.io.WebSocketClientConnection;
import org.eclipse.jetty.websocket.common.WebSocketRemoteEndpoint;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.powermock.core.classloader.annotations.PrepareForTest;
import org.powermock.modules.junit4.PowerMockRunner;

import com.scottlogic.hackathon.game.*;
import com.scottlogic.hackathon.remote.TeamId;
import com.scottlogic.hackathon.remote.serialization.GameStateFixture;
import com.scottlogic.hackathon.remote.serialization.MakeMovesFixture;
import com.scottlogic.hackathon.remote.serialization.TeamIdBroker;

import static com.scottlogic.hackathon.remote.client.RemoteClient.GAME_OVER_MESSAGE;
import static org.junit.Assert.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.powermock.api.mockito.PowerMockito.*;

@RunWith(PowerMockRunner.class)
@PrepareForTest(BotStub.class)
public class RemoteClientTest {
  @Test
  public void testOnConnect() throws Exception {
    // Given
    TeamId team = new TeamId("team1", new Id(9999L));
    FakeRemoteClient rc =
        spy(
            new FakeRemoteClient(
                new BotStub(team.getId(), team.getName(), mock(MakeMovesFixture.class))));
    Session session = mock(Session.class);
    UpgradeResponse ur = mock(UpgradeResponse.class);
    RemoteEndpoint remote = mock(RemoteEndpoint.class);
    when(session.getRemote()).thenReturn(remote);
    when(session.getUpgradeResponse()).thenReturn(ur);
    when(ur.getHeader("id")).thenReturn("9999");

    String SERIALIZED_TEAMID = TeamIdBroker.serialize(team);

    // When
    rc.onConnect(session);
    // Then
    verify(session.getRemote(), times(1)).sendString(SERIALIZED_TEAMID);
    assertEquals(rc.getState(), RemoteClient.State.INITIALISE);
  }

  @Test
  public void testOnMessage_Initialise() throws Exception {
    // Given
    GameStateFixture gameStateFixture = new GameStateFixture();
    TeamId team = new TeamId("team1", UniqueIdGenerator.INSTANCE.next());
    BotStub bot = spy(new BotStub(team.getId(), team.getName(), mock(MakeMovesFixture.class)));
    FakeRemoteClient rc = spy(new FakeRemoteClient(bot));
    Session session = mock(Session.class);
    RemoteEndpoint remote = mock(RemoteEndpoint.class);
    when(session.getRemote()).thenReturn(remote);
    rc.setState(RemoteClient.State.INITIALISE);
    // When
    rc.onMessage(session, gameStateFixture.gameStateJson);
    // Then
    verify(session.getRemote(), times(0)).sendString(any());
    verify(bot, times(1)).initialise(gameStateFixture.gameState);
    assertEquals(rc.getState(), RemoteClient.State.MOVES);
  }

  @Test
  public void testOnMessage_Moves() throws Exception {
    // Given
    GameStateFixture gameStateFixture = new GameStateFixture();
    MakeMovesFixture makeMovesFixture = new MakeMovesFixture();
    TeamId team = new TeamId("team1", UniqueIdGenerator.INSTANCE.next());
    BotStub bot = spy(new BotStub(team.getId(), team.getName(), makeMovesFixture));
    FakeRemoteClient rc = spy(new FakeRemoteClient(bot));
    Session session = mock(Session.class);
    DummyEndpoint remote = spy(new DummyEndpoint());
    when(session.getRemote()).thenReturn(remote);

    rc.setState(RemoteClient.State.MOVES);
    rc.setSession(session);
    // When
    rc.onMessage(session, gameStateFixture.gameStateJson);
    // Then
    verify(session.getRemote(), times(1)).sendString(makeMovesFixture.movesJson);
    verify(bot, times(1)).makeMoves(gameStateFixture.gameState);
    assertEquals(rc.getState(), RemoteClient.State.MOVES);
  }

  @Test
  public void testOnMessage_GameOver() throws Exception {
    // Given
    TeamId team = new TeamId("team1", UniqueIdGenerator.INSTANCE.next());
    BotStub bot = spy(new BotStub(team.getId(), team.getName(), mock(MakeMovesFixture.class)));
    FakeRemoteClient rc = spy(new FakeRemoteClient(bot));
    Session session = mock(Session.class);
    DummyEndpoint remote = spy(new DummyEndpoint());
    when(session.getRemote()).thenReturn(remote);
    rc.setState(RemoteClient.State.MOVES);
    rc.setSession(session);

    // When
    rc.onMessage(session, GAME_OVER_MESSAGE);

    // Then
    verify(session.getRemote(), times(0)).sendString(any());
    assertEquals(rc.getState(), RemoteClient.State.INITIALISE);
  }
}

class DummyEndpoint extends WebSocketRemoteEndpoint {

  public DummyEndpoint() {
    super(mock(WebSocketClientConnection.class), null);
  }

  @Override
  public void sendString(String text) throws IOException {
    // do nothing
  }
}

class BotStub extends Bot {
  MakeMovesFixture makeMovesFixture;

  BotStub(Id id, String team, MakeMovesFixture makeMovesFixture) {
    super(id, team);
    this.makeMovesFixture = makeMovesFixture;
  }

  @Override
  public List<Move> makeMoves(GameState gameState) {
    return makeMovesFixture.moves;
  }
}

class FakeRemoteClient extends RemoteClient {

  public FakeRemoteClient(Bot contestantBot) {
    super(contestantBot);
  }

  State getState() {
    return currentState;
  }

  void setState(State state) {
    this.currentState = state;
  }

  void setSession(Session session) {
    this.session = session;
  }
}
