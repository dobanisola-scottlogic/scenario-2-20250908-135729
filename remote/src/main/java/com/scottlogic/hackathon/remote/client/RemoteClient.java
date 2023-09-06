package com.scottlogic.hackathon.remote.client;

import java.io.IOException;
import java.util.List;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.TimeUnit;
import org.eclipse.jetty.websocket.api.Session;
import org.eclipse.jetty.websocket.api.annotations.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.scottlogic.hackathon.game.Bot;
import com.scottlogic.hackathon.game.Id;
import com.scottlogic.hackathon.game.Move;
import com.scottlogic.hackathon.remote.TeamId;
import com.scottlogic.hackathon.remote.serialization.GameStateBroker;
import com.scottlogic.hackathon.remote.serialization.MakeMovesBroker;
import com.scottlogic.hackathon.remote.serialization.TeamIdBroker;

import static com.scottlogic.hackathon.remote.client.RemoteClient.State.*;

@WebSocket
public class RemoteClient {

  private static final Logger logger = LoggerFactory.getLogger(RemoteClient.class);

  enum State {
    CONNECT,
    INITIALISE,
    MOVES,
  }

  public static final String GAME_OVER_MESSAGE = "GAME_OVER";
  private final Bot contestantBot;
  protected State currentState;
  protected Session session;
  private final CountDownLatch closeLatch = new CountDownLatch(1);
  private SimpleStatsCollector stats = new SimpleStatsCollector();

  public RemoteClient(Bot contestantBot) {
    this.contestantBot = contestantBot;
    currentState = CONNECT;
  }

  @OnWebSocketConnect
  public void onConnect(Session session) {
    logger.debug("Connected to server");
    this.session = session;
    updateBotId(Long.parseLong(session.getUpgradeResponse().getHeader("id")));
    send(TeamIdBroker.serialize(teamId(contestantBot)));
    currentState = INITIALISE;
  }

  private void send(String message) {
    try {
      session.getRemote().sendString(message);
    } catch (IOException e) {
      e.printStackTrace();
    }
  }

  @OnWebSocketMessage
  public void onMessage(Session session, String message) throws IOException {

    logger.trace("received message: " + message);
    if (GAME_OVER_MESSAGE.equals(message)) {
      stats.logStats();
      stats.reset();
      logger.debug("Initialising New Game!");
      currentState = INITIALISE;
    } else {
      switch (currentState) {
        case INITIALISE:
          {
            contestantBot.initialise(GameStateBroker.deserialize(message));
            currentState = MOVES;
            break;
          }
        case MOVES:
          {
            stats.recordStart("makeMoves");
            List<Move> moves = contestantBot.makeMoves(GameStateBroker.deserialize(message));
            stats.recordEnd();
            send(MakeMovesBroker.serialize(moves));
            break;
          }
      }
    }
  }

  @OnWebSocketClose
  public void close(Session session, int code, String msg) {
    this.session.close();
    closeLatch.countDown();
  }

  @OnWebSocketError
  public void error(Throwable t) {
    closeLatch.countDown();
  }

  static TeamId teamId(Bot bot) {
    return new TeamId(bot.getDisplayName(), bot.getId());
  }

  public boolean awaitClose(int duration, TimeUnit unit) throws InterruptedException {
    return this.closeLatch.await(duration, unit);
  }

  private void updateBotId(long serverGeneratedId) {
    logger.info("id -> " + serverGeneratedId);
    this.contestantBot.setId(new Id(serverGeneratedId));
  }
}
