package com.scottlogic.hackathon.game.engine.maps;

import com.scottlogic.hackathon.game.Position;

import java.util.HashSet;
import java.util.Set;

public class FourPlayerCross extends PlayableMapImpl {
    public FourPlayerCross() throws IllegalArgumentException {
        super(128, 64, createOutOfBoundsPositions(), createSpawnPointPositions());
    }

    private static Set<Position> createOutOfBoundsPositions() {
        final Set<Position> outOfBoundsPositions = new HashSet<Position>();
        for (int x = 50; x <= 76; x++) {
            for (int y = 30; y <= 34; y++) {
                outOfBoundsPositions.add(new Position(x, y));
            }
        }
        for (int x = 60; x <= 66; x++) {
            for (int y = 24; y <= 40; y++) {
                outOfBoundsPositions.add(new Position(x, y));
            }
        }

        return outOfBoundsPositions;
    }

    private static Set<Position> createSpawnPointPositions() {
        final Set<Position> spawnPointPositions = new HashSet<Position>();
        spawnPointPositions.add(new Position(32, 8));
        spawnPointPositions.add(new Position(32, 56));
        spawnPointPositions.add(new Position(96, 8));
        spawnPointPositions.add(new Position(96, 56));

        return spawnPointPositions;
    }
}
