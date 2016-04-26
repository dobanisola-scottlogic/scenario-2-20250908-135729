package com.scottlogic.hackathon.game.engine.maps;

import com.scottlogic.hackathon.game.Direction;
import com.scottlogic.hackathon.game.Position;

import java.util.Set;
import java.util.stream.Stream;

public interface PlayableMap {
    int getWidth();
    int getHeight();
    Set<Position> getOutOfBoundsPositions();
    Set<Position> getSpawnPointPositions();
    boolean contains(Position position);
    Position calculatePosition(Position position, Direction direction);
    Position calculatePosition(Position position, Direction direction, int distance);
    Stream<Position> getSurroundingPositions(Position position, int distance, boolean includeOrigin);
    int distanceBetween(final Position a, final Position b);
}
