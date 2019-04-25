package com.scottlogic.hackathon.game.engine.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.File;
import java.io.FileInputStream;
import java.io.InputStream;
import java.util.Properties;
import java.util.function.Consumer;
import java.util.function.Function;

public class GameConfigFileReader {
    private static final Logger LOGGER = LoggerFactory.getLogger(GameConfigFileReader.class);

    public GameConfigLayer read(String filePath) {
        GameConfigLayerBuilder configBuilder = new GameConfigLayerBuilder();
        Properties props = loadProperties(filePath);

        readIntegerIfPresent(props, "maxPhases", configBuilder::setTurnLimit);
        readIntegerIfPresent(props, "makeMovesTimeoutMillis", configBuilder::setMakeMovesTimeoutMillis);
        readIntegerIfPresent(props, "initialiseTimeoutMillis", configBuilder::setInitialiseTimeoutMillis);
        readDoubleIfPresent(props, "perTurnFoodSpawnProbability", configBuilder::setFoodSpawnProbability);
        readIntegerIfPresent(props, "battleRadius", configBuilder::setBattleRadius);
        readIntegerIfPresent(props, "maxCollectablesSpawnedPerPhase", configBuilder::setMaxFoodSpawnedPerTurn);
        readIntegerIfPresent(props, "minCollectableDistanceFromSpawn", configBuilder::setMinFoodDistanceFromSpawn);
        readIntegerIfPresent(props, "spawnPhases", configBuilder::setInitialUnitCount);
        readIntegerIfPresent(props, "maxVisibleDistance", configBuilder::setViewDistance);

        return configBuilder.build();
    }

    private static Properties loadProperties(String filePath) {
        Properties props = new Properties();

        File file = new File(filePath);
        if (file.isFile()) {
            try (InputStream inputStream = new FileInputStream(file)) {
                props.load(inputStream);
            } catch (Exception e) {
                LOGGER.error("Error loading config file: ", e);
            }
        }

        return props;
    }

    private static void readIntegerIfPresent(Properties props, String fieldName, Consumer<Integer> handleValue) {
        readConfigValueIfPresent(props, fieldName, Integer::parseInt, handleValue);
    }

    private static void readDoubleIfPresent(Properties props, String fieldName, Consumer<Double> handleValue) {
        readConfigValueIfPresent(props, fieldName, Double::parseDouble, handleValue);
    }

    private static <T> void readConfigValueIfPresent(
        Properties props,
        String fieldName,
        Function<String, T> parseFunction,
        Consumer<T> handleValue) {

        try {
            String property = props.getProperty(fieldName);

            if (property != null) {
                T parsedValue = parseFunction.apply(property);
                handleValue.accept(parsedValue);
            }
        } catch (Exception e) {
            LOGGER.error("Error parsing config value: {}", fieldName, e);
        }
    }
}
