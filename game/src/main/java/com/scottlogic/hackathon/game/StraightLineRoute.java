package com.scottlogic.hackathon.game;

import java.util.Iterator;
import java.util.NoSuchElementException;
import java.util.Optional;

class StraightLineRoute extends AbstractRoute {

    private final Direction direction;
    private final int length;

    StraightLineRoute(Map map, Position start, Direction direction, int length) {
        super(map, start);
        this.direction = direction;
        this.length = length;
    }


    @Override
    public Iterator<Direction> directionIterator() {
        return new DirectionIterator();
    }

    @Override
    public int getLength() {
        return length;
    }

    @Override
    public Optional<Direction> getFirstDirection() {
        return length>0 ? Optional.of(direction) : Optional.empty();
    }

    @Override
    protected Route createNextStep(Map map, Position next) {
        return new StraightLineRoute(map, next, direction, length-1);
    }

    private final class DirectionIterator implements Iterator<Direction> {
        private int length = StraightLineRoute.this.length;

        @Override
        public boolean hasNext() {
            return length>0;
        }

        @Override
        public Direction next() {
            if(length--<=0) {
                throw new NoSuchElementException();
            }
            return direction;
        }
    }

}
