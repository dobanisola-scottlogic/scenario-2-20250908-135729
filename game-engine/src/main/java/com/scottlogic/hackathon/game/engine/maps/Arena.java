package com.scottlogic.hackathon.game.engine.maps;

import com.scottlogic.hackathon.game.GameGeometry;
import com.scottlogic.hackathon.game.Position;

import java.util.Set;

public interface Arena {
    String getName();
    GameGeometry getGeometry();
    Set<Position> getOutOfBoundsPositions();
    Set<Position> getSpawnPointPositions();
}
