package com.scottlogic.hackathon.remote.server;

import java.io.IOException;
import java.util.List;
import java.util.concurrent.Executors;
import java.util.concurrent.TimeUnit;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.scottlogic.hackathon.game.Move;
import com.scottlogic.hackathon.remote.*;
import com.scottlogic.hackathon.remote.notify.ConnectionChangeEvent;
import com.scottlogic.hackathon.remote.notify.ConnectionChangeSupport;
import com.scottlogic.hackathon.remote.serialization.GameStateBroker;
import com.scottlogic.hackathon.remote.serialization.MakeMovesBroker;
import com.scottlogic.hackathon.remote.serialization.TeamIdBroker;

import static com.scottlogic.hackathon.remote.server.RemoteBotSocketProtocol.State.GAME_OVER;
import static com.scottlogic.hackathon.remote.server.RemoteBotSocketProtocol.State.MAKE_MOVES;
import static com.scottlogic.hackathon.remote.server.RemoteBotSocketProtocol.State.WAITING;
import static java.util.Collections.emptyList;
import static java.util.Optional.ofNullable;

public class RemoteBotSocketProtocol {

  enum State {
    WAITING,
    MAKE_MOVES,
    GAME_OVER
  }

  private static final Logger logger = LoggerFactory.getLogger(RemoteBotSocketProtocol.class);
  private RemoteBotSocketProtocol.State state = WAITING;
  private final Turn turn;
  private final ConnectionChangeSupport changeSupport;
  private final Sender sender;
  protected RemoteBot bot;
  private HeartBeat hb;

  RemoteBotSocketProtocol(Sender sender, ConnectionChangeSupport changeSupport, Turn turn) {
    this.changeSupport = changeSupport;
    this.turn = turn;
    this.sender = sender;
  }

  void receive(String message) {
    try {
      logger.debug(
          "{} onMessage Server Bot:"
              + (bot == null ? "#" : bot.getId())
              + " STATE IS: {} RECEIVED: {}",
          getThreadName(),
          state,
          message);
      switch (state) {
        case WAITING:
          {
            createBot(message);
            startHeartBeat(500, TimeUnit.MILLISECONDS);
            initialise();
            sendMakeMoves();
            break;
          }
        default:
          {
            processMakeMoves(message);
            if (getState() == GAME_OVER) {
              makeFirstMove();
            }
            break;
          }
      }
    } catch (IOException e) {
      e.printStackTrace();
    }
  }

  void makeFirstMove() throws IOException {
    // initialise empty game state
    logger.debug("initialise: " + turn.getGameState());
    send(GameStateBroker.serialize(turn.getGameState()));
    setState(MAKE_MOVES);
    endTurn();
    // phase zero make moves
    logger.debug("makeFirstMove() make moves: " + turn.getGameState());
    send(GameStateBroker.serialize(turn.getGameState()));
  }

  void send(String message) throws IOException {
    logger.debug("{} GAME STATE IS: {} MESSAGE...{}", getThreadName(), state, message);
    sender.send(message);
  }

  void setState(State state) {
    this.state = state;
  }

  State getState() {
    return state;
  }

  void processMakeMoves(String input) throws IOException {
    endTurn(MakeMovesBroker.deserialize(input)); // List<Move> from input
    turn.waitForTurn();
    if (turn.isInitialise()) {
      setState(GAME_OVER);
      send(GAME_OVER.name());

    } else {
      send(GameStateBroker.serialize(turn.getGameState()));
    }
  }

  void sendMakeMoves() throws IOException {
    setState(MAKE_MOVES);
    turn.waitForTurn();
    send(GameStateBroker.serialize(turn.getGameState()));
  }

  void initialise() throws IOException {
    sendMakeMoves();
    endTurn();
  }

  void createBot(String input) throws IOException {
    TeamId teamId = TeamIdBroker.deserialize(input);
    notifyBotCreated(teamId.getName(), new RemoteBot(teamId, turn));
    logger.debug(
        "{} CREATE BOT TEAM NAME: {} ID: {} STATE IS: {}",
        getThreadName(),
        teamId.getName(),
        teamId.getId(),
        state);
  }

  void notifyBotDisconnected() {
    logger.trace(
        "{} firing propertyChange for propertyName: {} to {} listeners",
        getThreadName(),
        bot.getDisplayName(),
        changeSupport.count());
    changeSupport.fireChangeEvent(
        new ConnectionChangeEvent(bot.getDisplayName(), new RemoteBotCallback(bot, sender), null));
    setState(State.WAITING);
  }

  private void endTurn() {
    endTurn(emptyList());
  }

  private void endTurn(List<Move> moves) {
    bot.responseReceived(moves);
  }

  private void notifyBotCreated(String team, RemoteBot bot) throws IOException {
    this.bot = bot;
    if (hasListeners(team)) {
      logger.debug(
          "{} firing propertyChange for propertyName: {} to {} listeners",
          getThreadName(),
          team,
          changeSupport.count());
      changeSupport.fireChangeEvent(
          new ConnectionChangeEvent(
              bot.getDisplayName(), null, new RemoteBotCallback(bot, sender)));
    } else {
      logger.warn(
          "Not expecting connection for team {} - Has team been defined by Admin? Or has the contestant selected connect?",
          team);
      sender.sendDisconnect();
    }
  }

  private boolean hasListeners(String team) {
    return changeSupport.hasTargetListener(team);
  }

  private String getThreadName() {
    return Thread.currentThread().getName();
  }

  void startHeartBeat(long period, TimeUnit timeUnit) {
    hb = new HeartBeat(sender, period, timeUnit, Executors.newSingleThreadScheduledExecutor());
    hb.start();
  }

  void cancelHeartBeat() {
    ofNullable(hb).ifPresent(HeartBeat::shutdown);
    hb = null;
  }
}
