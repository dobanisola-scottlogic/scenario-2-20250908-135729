package com.scottlogic.hackathon.game.engine.maps;

import com.fasterxml.jackson.core.JsonParseException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.scottlogic.hackathon.game.Position;
import com.scottlogic.hackathon.game.engine.config.GameConfigLayerBuilder;

import java.io.IOException;
import java.io.InputStream;
import java.util.*;

public class MapFileReader {
    private final ObjectMapper objectMapper = new ObjectMapper();

    public MapDetails readMapFile(String mapName) throws MapLoadException {
        final MapDto json;
        final String mapFilePath = "maps/" + mapName + ".json";
        try (InputStream inputStream = ClassLoader.getSystemResourceAsStream(mapFilePath)) {
            json = objectMapper.readValue(inputStream, LoadableMap.class);
        }
        catch(JsonParseException | JsonMappingException e) {
            throw new MapLoadException("Couldn't read JSON from json file: " + mapFilePath);
        }
        catch(IOException e) {
            throw new MapLoadException("Couldn't open json file: " + mapFilePath);
        }

        final int width;
        final int height;

        final Set<Position> outOfBoundsPositions = new HashSet<>();
        final Set<Position> spawnPointPositions = new HashSet<>();

        if (json.data != null) {
            width = json.width;
            height = json.height;
            final int[] data = json.data;

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
        }
        else if (json.map != null) {
            List<String> mapAsAscii = Arrays.asList(json.map);
            height = mapAsAscii.size();
            width = mapAsAscii.stream()
                .map(String::length)
                .findFirst()
                .orElseThrow(() -> new MapLoadException("Map file had empty ASCII map"));

            if (!mapAsAscii.stream().allMatch(line -> line.length() == width)) {
                throw new MapLoadException("Map file's ASCII map had inconsistent line lengths");
            }

            for (int y = 0; y < height; y++) {
                for (int x = 0; x < width; x++) {
                    final char datum = mapAsAscii.get(y).charAt(x);
                    if (datum == 'X') {
                        outOfBoundsPositions.add(new Position(x, y));
                    } else if (datum == 'B') {
                        spawnPointPositions.add(new Position(x, y));
                    }
                }
            }
        }
        else {
            throw new MapLoadException("Maps must have either data (plus width and height) or map populated");
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

        if (json.perTurnFoodSpawnProbability != null && (json.perTurnFoodSpawnProbability < 0 || json.perTurnFoodSpawnProbability > 1)) {
            throw new MapLoadException("perTurnFoodSpawnProbability must be >=0 and <=1");
        }

        GameConfigLayerBuilder configBuilder = new GameConfigLayerBuilder();

        if (json.maximumFoodCount != null) configBuilder.setMaximumFoodCount(json.maximumFoodCount);
        if (json.perTurnFoodSpawnProbability != null) configBuilder.setFoodSpawnProbability(json.perTurnFoodSpawnProbability);
        if (json.maximumTurnCount != null) configBuilder.setTurnLimit(json.maximumTurnCount);
        if (json.initialUnitSpawnCount != null) configBuilder.setInitialUnitCount(json.initialUnitSpawnCount);
        if (json.battleRadius != null) configBuilder.setBattleRadius(json.battleRadius);
        if (json.viewDistance != null) configBuilder.setViewDistance(json.viewDistance);

        return new MapDetails(arena, configBuilder.build());
    }
}
