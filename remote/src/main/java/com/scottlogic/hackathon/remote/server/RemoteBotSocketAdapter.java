package com.scottlogic.hackathon.remote.server;

import java.io.IOException;
import java.nio.ByteBuffer;
import java.util.concurrent.CountDownLatch;
import org.eclipse.jetty.websocket.api.Session;
import org.eclipse.jetty.websocket.api.WebSocketAdapter;
import org.eclipse.jetty.websocket.api.WebSocketException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class RemoteBotSocketAdapter extends WebSocketAdapter {

  private static final Logger logger = LoggerFactory.getLogger(RemoteBotSocketAdapter.class);
  private final Receiver receiver;

  private final CountDownLatch latch = new CountDownLatch(1);

  RemoteBotSocketAdapter(Receiver receiver) {
    this.receiver = receiver;
  }

  @Override
  public void onWebSocketConnect(Session sess) {
    super.onWebSocketConnect(sess);
    latch.countDown();
  }

  @Override
  public void onWebSocketText(String message) {
    if (isNotConnected()) {
      logger.error("Not connected!!");
      return;
    }
    receiver.receive(message);
  }

  void close() {
    getSession().close();
    try {
      getSession().getRemote().flush();
    } catch (IOException | WebSocketException e) {
    }
  }

  void send(String message) throws IOException {
    try {
      latch.await();
      getRemote().sendString(message);
    } catch (InterruptedException e) {
      e.printStackTrace();
    } finally {
      latch.countDown();
    }
  }

  boolean sendPing() {
    String data = "You There?";
    ByteBuffer payload = ByteBuffer.wrap(data.getBytes());
    try {
      latch.await();
      getRemote().sendPing(payload);
      getRemote().flush();
      logger.trace("sent ping!");
    } catch (Exception e) {
      logger.warn("ping failed!");
      return false;
    } finally {
      latch.countDown();
    }
    return true;
  }

  @Override
  public void onWebSocketError(Throwable cause) {
    logger.error("-->onWebSocketError " + cause.getLocalizedMessage());
  }
}
