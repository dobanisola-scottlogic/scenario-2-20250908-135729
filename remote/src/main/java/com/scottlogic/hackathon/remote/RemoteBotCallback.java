package com.scottlogic.hackathon.remote;

import lombok.Value;

import com.scottlogic.hackathon.remote.server.Sender;

@Value
public class RemoteBotCallback {
  final RemoteBot bot;
  final Sender sender;
}
