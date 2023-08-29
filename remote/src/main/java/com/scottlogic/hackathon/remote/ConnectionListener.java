package com.scottlogic.hackathon.remote;

import java.io.IOException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.scottlogic.hackathon.remote.notify.ChangeEventListener;
import com.scottlogic.hackathon.remote.notify.ConnectionChangeEvent;

/**
 * Listens for events regarding connection/disconnection of client.
 *
 * <p>When there is a new connection for the Team associated with the connector calls {@link
 * RemoteBotConnector#connected(RemoteBotCallback)} When there is a disconnect for the Team
 * associated with the connector calls {@link RemoteBotConnector#waitForConnect(String)}
 *
 * <p>When the same team connects multiple times then the second connection causes the first to be
 * disconnected
 */
public class ConnectionListener implements ChangeEventListener<ConnectionChangeEvent> {
  private final RemoteBotConnector connector;
  private final Logger logger;

  public ConnectionListener(final RemoteBotConnector connector) {
    this.connector = connector;
    logger = LoggerFactory.getLogger(this.getClass().getName());
  }

  public boolean isTeam(String propName) {
    return connector.getTeam().equals(propName);
  }

  private boolean isTeamConnect(String propertyName, Object newValue) {
    return isTeam(propertyName) && newValue instanceof RemoteBotCallback;
  }

  private boolean isTeamDisconnect(String propertyName, Object oldValue) {
    return isTeam(propertyName) && oldValue instanceof RemoteBotCallback;
  }

  private void sendClientDisconnect(String team, Object newValue, Object oldValue) {
    try {
      if (newValue instanceof RemoteBotCallback) {
        ((RemoteBotCallback) newValue).getSender().sendDisconnect();
      } else if (oldValue instanceof RemoteBotCallback) {
        ((RemoteBotCallback) oldValue).getSender().sendDisconnect();
      }

    } catch (IOException ioe) {
      logger.warn(
          "unable to send client disconnect message to {} : {}", team, ioe.getLocalizedMessage());
    }
  }

  @Override
  public void onChangeEvent(ConnectionChangeEvent changeEvent) {
    String teamName = changeEvent.getTarget();
    RemoteBotCallback oldValue = changeEvent.getOldValue();
    RemoteBotCallback newValue = changeEvent.getNewValue();
    if (isTeamConnect(teamName, newValue)) {
      connector.connected(newValue);
      logger.debug("team: {} now connected", connector.getTeam());
    } else if (isTeamDisconnect(teamName, oldValue)) {
      // disconnected - wait for reconnect
      if ((oldValue).getBot().getId().equals(connector.getId())) {
        logger.debug("team: {} waiting to be connected", connector.getTeam());
        connector.waitForConnect(connector.getTeam());
      }
    }
  }
}
