package com.scottlogic.hackathon.server.models;

import com.sleepycat.persist.model.Persistent;

import java.util.Collections;
import java.util.HashSet;
import java.util.Set;
import java.util.stream.Collectors;

@Persistent
public class Map {
    private int width;
    private int height;
    private Set<Position> outOfBoundPositions;

    public Map() {
    }

    public Map(final int width,
               final int height,
               final Set<Position> outOfBoundPositions) {
        this.width = width;
        this.height = height;
        this.outOfBoundPositions = new HashSet<>(outOfBoundPositions);
    }

    public static Map create(final com.scottlogic.hackathon.game.GameResult gameResult) {
        return new Map(
                gameResult.getMap().getWidth(),
                gameResult.getMap().getHeight(),
                gameResult.getOutOfBoundPositions()
                        .stream()
                        .map(Position::create)
                        .collect(Collectors.toSet())
        );
    }

    public int getWidth() {
        return width;
    }

    public int getHeight() {
        return height;
    }

    public Set<Position> getOutOfBoundPositions() {
        return Collections.unmodifiableSet(outOfBoundPositions);
    }
}