package com.scottlogic.hackathon.game;

import java.util.Iterator;
import java.util.Optional;
import java.util.Spliterator;
import java.util.Spliterators;
import java.util.function.Consumer;

abstract class AbstractRoute implements Route {
    protected final Position start;
    private final Map map;

    public AbstractRoute(Map map, Position start) {
        this.map = map;
        this.start = start;
    }

    @Override
    public Iterator<Position> iterator() {
        return Spliterators.iterator(spliterator());
    }

    @Override
    public Spliterator<Position> spliterator() {
        return new Spliterators.AbstractSpliterator<Position>(getLength(),
                Spliterator.SIZED | Spliterator.ORDERED | Spliterator.NONNULL) {
            final Iterator<Direction> dirs = directionIterator();
            Position position = getStart();

            @Override
            public boolean tryAdvance(Consumer<? super Position> action) {
                Position pos = position;
                if(pos==null) {
                    return false;
                }
                position = dirs.hasNext() ? map.getNeighbour(pos, dirs.next()) : null;
                action.accept(pos);
                return true;
            }
        };
    }

    protected final Map getMap() {
        return map;
    }

    @Override
    public Position getStart() {
        return start;
    }

    protected abstract Route createNextStep(Map map, Position next);

    @Override
    public final Optional<Route> step() {
        return getFirstDirection()
                .map(d -> createNextStep(getMap(), getMap().getNeighbour(start, d)));
    }

    @Override
    public Spliterator<Direction> directionSpliterator() {
        return Spliterators.spliterator(directionIterator(), getLength(),
                Spliterator.NONNULL | Spliterator.ORDERED | Spliterator.SIZED);
    }
}
