package com.scottlogic.hackathon.remote.client;

import java.net.URI;
import java.util.concurrent.TimeUnit;
import org.eclipse.jetty.websocket.client.ClientUpgradeRequest;
import org.eclipse.jetty.websocket.client.WebSocketClient;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.scottlogic.hackathon.game.Bot;

public class ClientRunner {

  private static final Logger logger = LoggerFactory.getLogger(ClientRunner.class);
  private final Bot contestantBot;
  private final URI botSocketUri;

  public ClientRunner(ClientArgs args) {
    this.contestantBot = args.getBot();
    this.botSocketUri = args.getBotSocketUri();
    connect();
  }

  public void connect() {
    logger.info("URI: " + botSocketUri.toString());

    WebSocketClient wsClient = new WebSocketClient();
    wsClient.setMaxIdleTimeout(Long.MAX_VALUE);
    wsClient.setStopAtShutdown(true);
    RemoteClient rcClient = new RemoteClient(contestantBot);

    try {
      wsClient.start();
      ClientUpgradeRequest request = new ClientUpgradeRequest();
      wsClient.connect(rcClient, botSocketUri, request).get();
      rcClient.awaitClose(180, TimeUnit.MINUTES);
      wsClient.stop();
    } catch (Exception e) {

    }
  }
}
