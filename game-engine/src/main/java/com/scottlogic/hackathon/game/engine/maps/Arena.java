package com.scottlogic.hackathon.game.engine.maps;

import com.scottlogic.hackathon.game.GameMap;
import com.scottlogic.hackathon.game.Position;

import java.util.Set;
import java.util.stream.Stream;

public interface Arena extends GameMap {
    String getName();
    Set<Position> getOutOfBoundsPositions();
    Set<Position> getSpawnPointPositions();
    boolean contains(Position position);
    Stream<Position> getSurroundingPositions(Position position, int distance);
}
