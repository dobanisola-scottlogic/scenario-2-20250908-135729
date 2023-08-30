package com.scottlogic.hackathon.remote;

import java.util.Optional;
import java.util.concurrent.locks.Condition;
import java.util.concurrent.locks.Lock;
import java.util.concurrent.locks.ReentrantLock;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.scottlogic.hackathon.game.Id;
import com.scottlogic.hackathon.remote.notify.ChangeEventListener;
import com.scottlogic.hackathon.remote.notify.RemoteBotChangeEvent;
import com.scottlogic.hackathon.remote.notify.RemoteBotChangeSupport;
import com.scottlogic.hackathon.remote.server.RemoteBotSocketCreator;
import com.scottlogic.hackathon.remote.server.Sender;

import static com.scottlogic.hackathon.remote.RemoteBotConnector.State.CONNECTED;
import static com.scottlogic.hackathon.remote.RemoteBotConnector.State.WAITING;

/**
 * The RemoteBotConnector provides ability to block until a connection is made by a remote team
 * {@link RemoteBotConnector#getTeam()} Interested parties such as the {@linkplain
 * com.scottlogic.hackathon.server.services.RemoteBotStore} can register a listener to be notified
 * when a connection in made. The {@link RemoteBotConnector#getState()} returns the current state of
 * the connection to the remote contestants bot. The {@linkplain State#WAITING} indicates the {@link
 * RemoteBotConnector} is awaiting a connection from the contestant bot The {@linkplain
 * State#CONNECTED} indicates the {@link RemoteBotConnector} is has a connection with the contestant
 * bot
 */
public class RemoteBotConnector {

  public enum State {
    WAITING,
    CONNECTED
  }

  private State state = WAITING;
  private final Logger logger;
  private String team;
  private final Lock lock = new ReentrantLock();
  private final Condition connectCondition = lock.newCondition();
  private RemoteBotCallback botCallback;
  private final RemoteBotChangeSupport remoteBotObservable;

  public RemoteBotConnector() {
    ConnectionListener connectionListener = new ConnectionListener(this);
    RemoteBotSocketCreator.INSTANCE.addConnectionListener(connectionListener);
    remoteBotObservable = new RemoteBotChangeSupport();
    logger = LoggerFactory.getLogger(this.getClass().getName());
  }

  public void waitForConnect(final String team) {
    lock.lock();
    try {
      this.team = team;
      this.state = WAITING;
      botCallback = null;
      logger.debug("RemoteBotConnector waiting for connection " + team);
      connectCondition.await();
    } catch (InterruptedException e) {
      Thread.currentThread().interrupt();
    } finally {
      lock.unlock();
    }
  }

  void connected(RemoteBotCallback botCallback) {
    lock.lock();
    try {
      this.botCallback = botCallback;
      state = CONNECTED;
      notifyRemoteBotListeners(botCallback);
      connectCondition.signal();
      logger.debug("RemoteBotConnector connected " + team);
    } finally {
      lock.unlock();
    }
  }

  private void notifyRemoteBotListeners(RemoteBotCallback botCallback) {
    String teamName = botCallback.getBot().getDisplayName();
    RemoteBot remoteBot = botCallback.getBot();
    remoteBotObservable.fireChangeEvent(new RemoteBotChangeEvent(teamName, null, remoteBot));
  }

  public Optional<RemoteBot> getRemoteBot() {
    return Optional.ofNullable(botCallback).map(RemoteBotCallback::getBot);
  }

  public Optional<Sender> getRemoteSender() {
    return Optional.ofNullable(botCallback).map(RemoteBotCallback::getSender);
  }

  public String getTeam() {
    return team;
  }

  public Id getId() {
    return botCallback.getBot().getId();
  }

  public State getState() {
    return state;
  }

  public void addRemoteBotListener(ChangeEventListener<RemoteBotChangeEvent> listener) {
    remoteBotObservable.addChangeEventListener(listener);
  }

  public boolean isConnected() {
    return CONNECTED == state;
  }
}
