package com.scottlogic.hackathon.remote.notify;

import lombok.Value;

import com.scottlogic.hackathon.remote.RemoteBot;

@Value
public class RemoteBotChangeEvent implements ChangeEvent<RemoteBot> {
  String target;
  RemoteBot oldValue;
  RemoteBot newValue;
}
