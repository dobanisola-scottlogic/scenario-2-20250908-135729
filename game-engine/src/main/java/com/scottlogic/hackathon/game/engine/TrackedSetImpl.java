package com.scottlogic.hackathon.game.engine;

import java.util.*;
import java.util.stream.Stream;
import java.util.stream.StreamSupport;

import com.scottlogic.hackathon.game.TrackedSet;

public class TrackedSetImpl<T> implements TrackedSet<T> {
  private final Set<T> tracked;
  private final Set<T> added;
  private final Set<T> removed;

  public TrackedSetImpl() {
    tracked = new HashSet<T>();
    added = new HashSet<T>();
    removed = new HashSet<T>();
  }

  public TrackedSetImpl(final TrackedSetImpl<? extends T> source) {
    tracked = new HashSet<T>(source.getTracked());
    added = new HashSet<T>(source.getAdded());
    removed = new HashSet<T>(source.getRemoved());
  }

  public Set<T> getTracked() {
    return Collections.unmodifiableSet(tracked);
  }

  public Set<T> getAdded() {
    return Collections.unmodifiableSet(added);
  }

  public Set<T> getRemoved() {
    return Collections.unmodifiableSet(removed);
  }

  public boolean contains(final T item) {
    return tracked.contains(item);
  }

  public Stream<T> stream() {
    return StreamSupport.stream(
        Spliterators.spliterator(iterator(), size(), Spliterator.IMMUTABLE | Spliterator.DISTINCT),
        false);
  }

  public Iterator<T> iterator() {
    return tracked.iterator();
  }

  public int size() {
    return tracked.size();
  }

  public void reset() {
    added.clear();
    removed.clear();
  }

  public void addAll(final Iterable<? extends T> items) {
    for (final T item : items) {
      add(item);
    }
  }

  public boolean add(final T item) {
    final boolean added = tracked.add(item);
    if (added) {
      this.added.add(item);
    }
    return added;
  }

  public void removeAll(final Iterable<? extends T> items) {
    for (final T item : items) {
      remove(item);
    }
  }

  public boolean remove(final T item) {
    final boolean removed = tracked.remove(item);
    if (removed) {
      this.removed.add(item);
    }
    return removed;
  }

  public boolean replace(final T find, final T replace) {
    final boolean found = tracked.contains(find);
    if (found) {
      tracked.remove(find);
      tracked.add(replace);
    }
    return found;
  }

  private class TrackedSetIterator implements Iterator<T> {
    private final Iterator<T> tracked;
    private T current;

    public TrackedSetIterator(final Iterator<T> tracked) {
      this.tracked = tracked;
    }

    @Override
    public boolean hasNext() {
      return tracked.hasNext();
    }

    @Override
    public T next() {
      current = tracked.next();
      return current;
    }

    @Override
    public void remove() {
      tracked.remove();
      if (current != null) {
        removed.add(current);
        current = null;
      } else {
        throw new NullPointerException();
      }
    }
  }
}
