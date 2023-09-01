package com.scottlogic.hackathon.remote.notify;

public interface ChangeEventListener<T extends ChangeEvent<?>> {
  void onChangeEvent(T changeEvent);
}
