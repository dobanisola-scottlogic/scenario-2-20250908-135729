package com.scottlogic.hackathon.server.models;

import com.scottlogic.hackathon.game.engine.maps.PlayableMap;
import com.sleepycat.persist.model.Persistent;

import java.util.Collections;
import java.util.HashSet;
import java.util.Set;
import java.util.stream.Collectors;

@Persistent
public class Map {
    private String name;
    private int width;
    private int height;
    private Set<Position> outOfBoundPositions;

    public Map() {
    }

    public Map(final String name,
               final int width,
               final int height,
               final Set<Position> outOfBoundPositions) {
        this.name = name;
        this.width = width;
        this.height = height;
        this.outOfBoundPositions = new HashSet<>(outOfBoundPositions);
    }

    public static Map create(final PlayableMap playableMap) {
        return new Map(
                playableMap.getClass().getName(),
                playableMap.getWidth(),
                playableMap.getHeight(),
                playableMap.getOutOfBoundsPositions()
                        .stream()
                        .map(Position::create)
                        .collect(Collectors.toSet())
        );
    }

    public String getName() {
        return name;
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