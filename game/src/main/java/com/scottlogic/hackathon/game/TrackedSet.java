package com.scottlogic.hackathon.game;

import java.util.Set;
import java.util.stream.Stream;

public interface TrackedSet<T> extends Iterable<T> {
  Set<T> getTracked();

  Set<T> getAdded();

  Set<T> getRemoved();

  boolean contains(T item);

  Stream<T> stream();

  int size();
}
