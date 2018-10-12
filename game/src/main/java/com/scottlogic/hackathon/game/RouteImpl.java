package com.scottlogic.hackathon.game;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.Optional;
import java.util.Spliterator;
import java.util.Spliterators;
import java.util.function.Consumer;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

class RouteImpl implements Route {

    private final Position start;
    private final Map map;
    private final List<Direction> list;
    private final int index;

    public RouteImpl(Map map, Position start, Direction direction, int length) {
        this(map, start, IntStream.range(0, length).mapToObj(i -> direction)
                .collect(Collectors.toCollection(() -> new ArrayList<>(length))));
    }

    public RouteImpl(Map map, Position start, List<Direction> steps) {
        this(map, start, steps, 0);
    }

    private RouteImpl(Map map, Position start, List<Direction> steps, int index) {
        this.map = map;
        this.start = start;
        this.list = steps;
        this.index = index;
    }

    @Override
    public int getLength() {
        return list.size() - index;
    }

    @Override
    public Optional<Direction> getFirstDirection() {
        return index < list.size() ? Optional.of(list.get(index)) : Optional.empty();
    }

    @Override
    public Iterator<Direction> directionIterator() {
        return list.listIterator(index);
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

    @Override
    public Position getStart() {
        return start;
    }

    @Override
    public final Optional<Route> step() {
        return getFirstDirection()
                .map(d -> new RouteImpl(map, map.getNeighbour(start, d), list, index+1));
    }

    @Override
    public Spliterator<Direction> directionSpliterator() {
        return Spliterators.spliterator(directionIterator(), getLength(),
                Spliterator.NONNULL | Spliterator.ORDERED | Spliterator.SIZED);
    }

}
