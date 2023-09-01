package com.scottlogic.hackathon.remote.notify;

import lombok.Value;

import com.scottlogic.hackathon.remote.RemoteBotCallback;

@Value
public class ConnectionChangeEvent implements ChangeEvent<RemoteBotCallback> {
  String target;
  RemoteBotCallback oldValue;
  RemoteBotCallback newValue;
}
