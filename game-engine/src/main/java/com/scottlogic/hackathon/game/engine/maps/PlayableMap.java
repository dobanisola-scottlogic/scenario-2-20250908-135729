package com.scottlogic.hackathon.game.engine.maps;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.scottlogic.hackathon.game.Direction;
import com.scottlogic.hackathon.game.Map;
import com.scottlogic.hackathon.game.Position;

import java.io.InputStream;
import java.util.HashSet;
import java.util.Set;
import java.util.stream.Stream;

public interface PlayableMap extends Map {
    static PlayableMap load(final String mapName) throws Exception {
        final InputStream inputStream = ClassLoader.getSystemResourceAsStream("maps/" + mapName + ".json");
        final ObjectMapper objectMapper = new ObjectMapper();
        final LoadableMap map = objectMapper.readValue(inputStream, LoadableMap.class);

        final Set<Position> outOfBoundsPositions = new HashSet<>();
        final Set<Position> spawnPointPositions = new HashSet<>();

        final int width = map.getWidth();
        final int height = map.getHeight();
        final int[] data = map.getData();

        for (int y = 0; y < height; y++) {
            for (int x = 0; x < width; x++) {
                final int datum = data[(y * width) + x];
                if (datum == 1) {
                    outOfBoundsPositions.add(new Position(x, y));
                } else if (datum == 2) {
                    spawnPointPositions.add(new Position(x, y));
                }
            }
        }

        final PlayableMap playableMap = new PlayableMapImpl(
                mapName,
                width,
                height,
                outOfBoundsPositions,
                spawnPointPositions);

        return playableMap;
    }

    String getName();
    Set<Position> getOutOfBoundsPositions();
    Set<Position> getSpawnPointPositions();
    boolean contains(Position position);
    Stream<Position> getSurroundingPositions(Position position, int distance);
}
