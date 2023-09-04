package com.scottlogic.hackathon.remote.notify;

import java.util.ArrayList;
import java.util.List;

public class RemoteBotChangeSupport
    implements ChangeSupport<ChangeEventListener<RemoteBotChangeEvent>, RemoteBotChangeEvent> {
  private List<ChangeEventListener<RemoteBotChangeEvent>> listeners = new ArrayList<>();

  @Override
  public void addChangeEventListener(ChangeEventListener<RemoteBotChangeEvent> toAdd) {
    listeners.add(toAdd);
  }

  @Override
  public void fireChangeEvent(RemoteBotChangeEvent event) {
    listeners.forEach(l -> l.onChangeEvent(event));
  }
}
