package com.scottlogic.hackathon.server.models;

import com.fasterxml.jackson.annotation.JsonView;
import com.scottlogic.hackathon.game.engine.maps.Arena;

import java.util.Collections;
import java.util.HashSet;
import java.util.Set;
import java.util.stream.Collectors;

public class ArenaModel {
    @JsonView(Views.List.class)
    private String name;
    @JsonView(Views.List.class)
    private int width;
    @JsonView(Views.List.class)
    private int height;
    @JsonView(Views.Details.class)
    private Set<Position> outOfBoundPositions;

    public ArenaModel() {
    }

    public ArenaModel(final String name,
               final int width,
               final int height,
               final Set<Position> outOfBoundPositions) {
        this.name = name;
        this.width = width;
        this.height = height;
        this.outOfBoundPositions = new HashSet<>(outOfBoundPositions);
    }

    public static ArenaModel create(final Arena arena) {
        return new ArenaModel(
                arena.getName(),
                arena.getGeometry().getWidth(),
                arena.getGeometry().getHeight(),
                arena.getOutOfBoundsPositions()
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