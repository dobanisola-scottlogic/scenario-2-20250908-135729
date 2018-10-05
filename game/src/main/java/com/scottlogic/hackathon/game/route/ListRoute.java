package com.scottlogic.hackathon.game.route;

import com.scottlogic.hackathon.game.Direction;
import com.scottlogic.hackathon.game.Map;
import com.scottlogic.hackathon.game.Position;
import com.scottlogic.hackathon.game.Route;

import java.util.Iterator;
import java.util.List;
import java.util.Optional;

public class ListRoute extends AbstractRoute {

    private final List<Direction> list;
    private final int index;

    public ListRoute(Map map, Position start, List<Direction> steps) {
        this(map, start, steps, 0);
    }

    private ListRoute(Map map, Position start, List<Direction> steps, int index) {
        super(map, start);
        this.list = steps;
        this.index = index;
    }

    @Override
    public int getLength() {
        return list.size() - index;
    }

    @Override
    protected Route createNextStep(Map map, Position next) {
        return new ListRoute(map, next, list, index+1);
    }

    @Override
    public Optional<Direction> getFirstDirection() {
        return index < list.size() ? Optional.of(list.get(index)) : Optional.empty();
    }

    @Override
    public Iterator<Direction> directionIterator() {
        return list.listIterator(index);
    }

}
