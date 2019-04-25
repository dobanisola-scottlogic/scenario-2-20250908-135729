package com.scottlogic.hackathon.game.engine.maps;

import com.fasterxml.jackson.core.JsonParseException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.scottlogic.hackathon.game.Position;
import com.scottlogic.hackathon.game.engine.config.GameConfigLayerBuilder;

import java.io.IOException;
import java.io.InputStream;
import java.util.HashSet;
import java.util.Set;

public class MapFileReader {
    private final ObjectMapper objectMapper = new ObjectMapper();

    public MapDetails readMapFile(String mapName) throws MapLoadException {
        final LoadableMap map;
        final String mapFilePath = "maps/" + mapName + ".json";
        try (InputStream inputStream = ClassLoader.getSystemResourceAsStream(mapFilePath)) {
            map = objectMapper.readValue(inputStream, LoadableMap.class);
        }
        catch(JsonParseException | JsonMappingException e) {
            throw new MapLoadException("Couldn't read JSON from map file: " + mapFilePath);
        }
        catch(IOException e) {
            throw new MapLoadException("Couldn't open map file: " + mapFilePath);
        }


        final Set<Position> outOfBoundsPositions = new HashSet<>();
        final Set<Position> spawnPointPositions = new HashSet<>();

        final int width = map.getWidth();
        final int height = map.getHeight();
        final int[] data = map.getData();

        if (height * width != data.length) {
            throw new MapLoadException("Map is invalid; wrong number of cells");
        }

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

        final Arena arena;

        try {
            arena = new ArenaImpl(
                mapName,
                width,
                height,
                outOfBoundsPositions,
                spawnPointPositions);
        }
        catch (IllegalArgumentException e) {
            throw new MapLoadException("Map details were invalid: " + e.getMessage());
        }

        if (map.getPerTurnFoodSpawnProbability().isPresent() && (map.getPerTurnFoodSpawnProbability().get() < 0 || map.getPerTurnFoodSpawnProbability().get() > 1)) {
            throw new MapLoadException("perTurnFoodSpawnProbability must be >=0 and <=1");
        }

        GameConfigLayerBuilder configBuilder = new GameConfigLayerBuilder();

        map.getMaximumFoodCount().ifPresent(configBuilder::setMaximumFoodCount);
        map.getPerTurnFoodSpawnProbability().ifPresent(configBuilder::setFoodSpawnProbability);
        map.getMaximumTurnCount().ifPresent(configBuilder::setTurnLimit);
        map.getInitialUnitSpawnCount().ifPresent(configBuilder::setInitialUnitCount);
        map.getBattleRadius().ifPresent(configBuilder::setBattleRadius);
        map.getViewDistance().ifPresent(configBuilder::setViewDistance);

        return new MapDetails(arena, configBuilder.build());
    }
}

