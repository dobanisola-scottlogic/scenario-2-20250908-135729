package com.scottlogic.hackathon.game.engine;

import java.util.*;
import java.util.stream.Stream;
import java.util.stream.StreamSupport;

public class TrackedSet<T> implements Iterable<T> {
    private final Set<T> tracked = new HashSet<T>();
    private final Set<T> added = new HashSet<T>();
    private final Set<T> removed = new HashSet<T>();

    public Set<T> getTracked() {
        return Collections.unmodifiableSet(tracked);
    }

    public Set<T> getAdded() {
        return Collections.unmodifiableSet(added);
    }

    public Set<T> getRemoved() {
        return Collections.unmodifiableSet(removed);
    }

    public void reset() {
        added.clear();
        removed.clear();
    }

    public boolean contains(final Object o) {
        return tracked.contains(o);
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

    public Stream<T> stream() {
        return StreamSupport.stream(Spliterators.spliterator(iterator(), size(), Spliterator.IMMUTABLE | Spliterator.DISTINCT), false);

    }

    public Iterator<T> iterator() {
        return tracked.iterator();
    }

    public int size() {
        return tracked.size();
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
