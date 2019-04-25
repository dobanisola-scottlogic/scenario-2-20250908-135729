package com.scottlogic.hackathon.game.engine.maps;

import com.fasterxml.jackson.core.JsonParseException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.scottlogic.hackathon.game.GameGeometry;
import com.scottlogic.hackathon.game.Position;
import com.scottlogic.hackathon.game.engine.config.GameConfigLayer;
import com.scottlogic.hackathon.game.engine.config.GameConfigLayerBuilder;
import com.scottlogic.hackathon.game.engine.models.LoopingQuadsGameGeometry;

import java.io.IOException;
import java.io.InputStream;
import java.util.*;

/** Given the name of a map, tries to read it from the program's resources, throwing exceptions on failure. */
public class MapFileReader {
    private final ObjectMapper objectMapper = new ObjectMapper();

    public Arena readMapFile(String mapName) throws MapLoadException {
        final MapDto json;
        final String mapFilePath = "maps/" + mapName + ".json";
        try (InputStream inputStream = ClassLoader.getSystemResourceAsStream(mapFilePath)) {
            json = objectMapper.readValue(inputStream, MapDto.class);
        }
        catch(JsonParseException | JsonMappingException e) {
            throw new MapLoadException("Couldn't read JSON from json file: " + mapFilePath);
        }
        catch(IOException e) {
            throw new MapLoadException("Couldn't open json file: " + mapFilePath);
        }

        GameConfigLayer mapSpecificConfig = readConfigFromDto(json);

        final GameGeometry geometry;
        final Set<Position> outOfBoundsPositions = new HashSet<>();
        final Set<Position> spawnPointPositions = new HashSet<>();
        final Set<Position> foodSpawnPositions = new HashSet<>();

        if (json.data != null) {
            geometry = readArrayBasedGeometryAndObjects(json, outOfBoundsPositions, spawnPointPositions);
        }
        else if (json.map != null) {
            geometry = readStringBasedGeometryAndObjects(json.map, outOfBoundsPositions, spawnPointPositions, foodSpawnPositions);
        }
        else {
            throw new MapLoadException("Maps must have either `data` (plus `width` and `height`) or `map` populated");
        }

        try {
            return new Arena(
                mapName,
                geometry,
                outOfBoundsPositions,
                spawnPointPositions,
                foodSpawnPositions,
                mapSpecificConfig);
        }
        catch (IllegalArgumentException e) {
            throw new MapLoadException("Map details were invalid: " + e.getMessage());
        }
    }

    private static GameConfigLayer readConfigFromDto(MapDto json) {
        GameConfigLayerBuilder configBuilder = new GameConfigLayerBuilder();

        if (json.perTurnFoodSpawnProbability != null && (json.perTurnFoodSpawnProbability < 0 || json.perTurnFoodSpawnProbability > 1)) {
            throw new MapLoadException("perTurnFoodSpawnProbability must be >=0 and <=1");
        }

        if (json.maximumFoodCount != null) configBuilder.setMaximumFoodCount(json.maximumFoodCount);
        if (json.perTurnFoodSpawnProbability != null) configBuilder.setFoodSpawnProbability(json.perTurnFoodSpawnProbability);
        if (json.maximumTurnCount != null) configBuilder.setTurnLimit(json.maximumTurnCount);
        if (json.initialUnitSpawnCount != null) configBuilder.setInitialUnitCount(json.initialUnitSpawnCount);
        if (json.battleRadius != null) configBuilder.setBattleRadius(json.battleRadius);
        if (json.viewDistance != null) configBuilder.setViewDistance(json.viewDistance);

        return configBuilder.build();
    }

    private static GameGeometry readArrayBasedGeometryAndObjects(
        MapDto mapDto,
        Set<Position> outOfBoundsPositions,
        Set<Position> spawnPointPositions) {

        if (mapDto.height * mapDto.width != mapDto.data.length) {
            throw new MapLoadException("Map is invalid; wrong number of cells");
        }

        final GameGeometry geometry = new LoopingQuadsGameGeometry(mapDto.width, mapDto.height);

        for (int y = 0; y < mapDto.height; y++) {
            for (int x = 0; x < mapDto.width; x++) {
                final int datum = mapDto.data[(y * mapDto.width) + x];
                if (datum == 1) {
                    outOfBoundsPositions.add(geometry.getPosition(x, y));
                } else if (datum == 2) {
                    spawnPointPositions.add(geometry.getPosition(x, y));
                }
            }
        }

        return geometry;
    }

    private static GameGeometry readStringBasedGeometryAndObjects(
        String[] mapAsAscii,
        Set<Position> outOfBoundsPositions,
        Set<Position> spawnPointPositions,
        Set<Position> foodSpawnPositions) {

        List<String> mapLines = Arrays.asList(mapAsAscii);
        final int height = mapLines.size();
        final int width = mapLines.stream()
            .map(String::length)
            .findFirst()
            .orElseThrow(() -> new MapLoadException("Map file had empty ASCII map"));

        if (!mapLines.stream().allMatch(line -> line.length() == width)) {
            throw new MapLoadException("Map file's ASCII map had inconsistent line lengths");
        }

        final GameGeometry geometry = new LoopingQuadsGameGeometry(width, height);

        for (int y = 0; y < height; y++) {
            for (int x = 0; x < width; x++) {
                final char datum = mapLines.get(y).charAt(x);
                if (datum == 'X') {
                    outOfBoundsPositions.add(geometry.getPosition(x, y));
                } else if (datum == 'B') {
                    spawnPointPositions.add(geometry.getPosition(x, y));
                } else if (datum == '.') {
                    foodSpawnPositions.add(geometry.getPosition(x, y));
                }
            }
        }

        return geometry;
    }
}
