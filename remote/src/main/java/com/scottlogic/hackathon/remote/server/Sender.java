package com.scottlogic.hackathon.remote.server;

import java.io.IOException;

public interface Sender {
  void send(String message) throws IOException;

  void sendPing();

  void sendDisconnect() throws IOException;
}
