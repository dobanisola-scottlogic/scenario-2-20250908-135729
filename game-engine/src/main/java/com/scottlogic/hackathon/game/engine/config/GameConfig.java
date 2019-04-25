package com.scottlogic.hackathon.game.engine.config;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import java.util.function.Function;

public class GameConfig {
    private static GameConfig defaults = new GameConfig(
        512,
        500,
        2000,
        0.8,
        2,
        4,
        8,
        8,
        6,
        999999999);

    private Integer turnLimit;
    private Integer makeMovesTimeoutMillis;
    private Integer initialiseTimeoutMillis;
    private Double foodSpawnProbability;
    private Integer battleRadius;
    private Integer maxFoodSpawnedPerTurn;
    private Integer minFoodDistanceFromSpawn;
    private Integer initialUnitCount;
    private Integer viewDistance;
    private Integer maximumFoodCount;

    private GameConfig(
        Integer turnLimit,
        Integer makeMovesTimeoutMillis,
        Integer initialiseTimeoutMillis,
        Double foodSpawnProbability,
        Integer battleRadius,
        Integer maxFoodSpawnedPerTurn,
        Integer minFoodDistanceFromSpawn,
        Integer initialUnitCount,
        Integer viewDistance,
        Integer maximumFoodCount) {

        this.turnLimit = turnLimit;
        this.makeMovesTimeoutMillis = makeMovesTimeoutMillis;
        this.initialiseTimeoutMillis = initialiseTimeoutMillis;
        this.foodSpawnProbability = foodSpawnProbability;
        this.battleRadius = battleRadius;
        this.maxFoodSpawnedPerTurn = maxFoodSpawnedPerTurn;
        this.minFoodDistanceFromSpawn = minFoodDistanceFromSpawn;
        this.initialUnitCount = initialUnitCount;
        this.viewDistance = viewDistance;
        this.maximumFoodCount = maximumFoodCount;
    }

    /** Use the provided layers to override properties from the hardcoded defaults. Earlier-specified layers have precedence */
    public static GameConfig createFromDefaultsWithOverrides(final GameConfigLayer... layers) {
        List<GameConfigLayer> layerList = Arrays.asList(layers);

        return new GameConfig(
            getValueFromLayersOrDefaults(layerList, GameConfigLayer::getTurnLimit, GameConfig::getTurnLimit),
            getValueFromLayersOrDefaults(layerList, GameConfigLayer::getMakeMovesTimeoutMillis, GameConfig::getMakeMovesTimeoutMillis),
            getValueFromLayersOrDefaults(layerList, GameConfigLayer::getInitialiseTimeoutMillis, GameConfig::getInitialiseTimeoutMillis),
            getValueFromLayersOrDefaults(layerList, GameConfigLayer::getFoodSpawnProbability, GameConfig::getFoodSpawnProbability),
            getValueFromLayersOrDefaults(layerList, GameConfigLayer::getBattleRadius, GameConfig::getBattleRadius),
            getValueFromLayersOrDefaults(layerList, GameConfigLayer::getMaxFoodSpawnedPerTurn, GameConfig::getMaxFoodSpawnedPerTurn),
            getValueFromLayersOrDefaults(layerList, GameConfigLayer::getMinFoodDistanceFromSpawn, GameConfig::getMinFoodDistanceFromSpawn),
            getValueFromLayersOrDefaults(layerList, GameConfigLayer::getInitialUnitCount, GameConfig::getInitialUnitCount),
            getValueFromLayersOrDefaults(layerList, GameConfigLayer::getViewDistance, GameConfig::getViewDistance),
            getValueFromLayersOrDefaults(layerList, GameConfigLayer::getMaximumFoodCount, GameConfig::getMaximumFoodCount));
    }

    private static <T> T getValueFromLayersOrDefaults(
        List<GameConfigLayer> layers,
        Function<GameConfigLayer, Optional<T>> getValueFromLayer,
        Function<GameConfig, T> getValue) {

        for (GameConfigLayer layer : layers) {
            Optional<T> v = getValueFromLayer.apply(layer);

            if (v.isPresent()) return v.get();
        }

        return getValue.apply(defaults);
    }


    public Integer getTurnLimit() {
        return turnLimit;
    }

    public Integer getMakeMovesTimeoutMillis() {
        return makeMovesTimeoutMillis;
    }

    public Integer getInitialiseTimeoutMillis() {
        return initialiseTimeoutMillis;
    }

    public Double getFoodSpawnProbability() {
        return foodSpawnProbability;
    }

    public Integer getBattleRadius() {
        return battleRadius;
    }

    public Integer getMaxFoodSpawnedPerTurn() {
        return maxFoodSpawnedPerTurn;
    }

    public Integer getMinFoodDistanceFromSpawn() {
        return minFoodDistanceFromSpawn;
    }

    public Integer getInitialUnitCount() {
        return initialUnitCount;
    }

    public Integer getViewDistance() {
        return viewDistance;
    }

    public Integer getMaximumFoodCount() {
        return maximumFoodCount;
    }
}
