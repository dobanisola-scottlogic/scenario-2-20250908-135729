package com.scottlogic.hackathon.remote.notify;

public interface ChangeSupport<T extends ChangeEventListener, R extends ChangeEvent<?>> {

  void addChangeEventListener(T toAdd);

  void fireChangeEvent(R event);
}
