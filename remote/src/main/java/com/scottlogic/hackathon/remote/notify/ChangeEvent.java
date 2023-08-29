package com.scottlogic.hackathon.remote.notify;

public interface ChangeEvent<T> {
  String getTarget();

  T getOldValue();

  T getNewValue();
}
