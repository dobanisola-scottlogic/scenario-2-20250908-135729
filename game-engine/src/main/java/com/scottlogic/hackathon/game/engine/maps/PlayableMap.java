package com.scottlogic.hackathon.game.engine.maps;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.scottlogic.hackathon.game.Direction;
import com.scottlogic.hackathon.game.Position;

import java.io.InputStream;
import java.util.HashSet;
import java.util.Set;
import java.util.stream.Stream;

public interface PlayableMap {
    static PlayableMap load(final String mapName) throws Exception {
        final InputStream inputStream = ClassLoader.getSystemResourceAsStream("maps/" + mapName + ".json");
        final ObjectMapper objectMapper = new ObjectMapper();
        final Map map = objectMapper.readValue(inputStream, Map.class);

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
