package com.scottlogic.hackathon.game.engine.config;

import java.util.Optional;

public class GameConfigLayerBuilder {
    private Optional<Integer> turnLimit = Optional.empty();
    private Optional<Integer> makeMovesTimeoutMillis = Optional.empty();
    private Optional<Integer> initialiseTimeoutMillis = Optional.empty();
    private Optional<Double> foodSpawnProbability = Optional.empty();
    private Optional<Integer> battleRadius = Optional.empty();
    private Optional<Integer> maxFoodSpawnedPerTurn = Optional.empty();
    private Optional<Integer> minFoodDistanceFromSpawn = Optional.empty();
    private Optional<Integer> initialUnitCount = Optional.empty();
    private Optional<Integer> viewDistance = Optional.empty();
    private Optional<Integer> maximumFoodCount = Optional.empty();

    public void setTurnLimit(Integer value) {
        turnLimit = Optional.of(value);
    }

    public void setMakeMovesTimeoutMillis(Integer value) {
        makeMovesTimeoutMillis = Optional.of(value);
    }

    public void setInitialiseTimeoutMillis(Integer value) {
        initialiseTimeoutMillis = Optional.of(value);
    }

    public void setFoodSpawnProbability(Double value) {
        foodSpawnProbability = Optional.of(value);
    }

    public void setBattleRadius(Integer value) {
        battleRadius = Optional.of(value);
    }

    public void setMaxFoodSpawnedPerTurn(Integer value) {
        maxFoodSpawnedPerTurn = Optional.of(value);
    }

    public void setMinFoodDistanceFromSpawn(Integer value) {
        minFoodDistanceFromSpawn = Optional.of(value);
    }

    public void setInitialUnitCount(Integer value) {
        initialUnitCount = Optional.of(value);
    }

    public void setViewDistance(Integer value) {
        viewDistance = Optional.of(value);
    }

    public void setMaximumFoodCount(Integer value) {
        maximumFoodCount = Optional.of(value);
    }

    public GameConfigLayer build() {
        return new GameConfigLayerImpl(
            turnLimit,
            makeMovesTimeoutMillis,
            initialiseTimeoutMillis,
            foodSpawnProbability,
            battleRadius,
            maxFoodSpawnedPerTurn,
            minFoodDistanceFromSpawn,
            initialUnitCount,
            viewDistance,
            maximumFoodCount);
    }

    class GameConfigLayerImpl implements GameConfigLayer {
        private Optional<Integer> turnLimit;
        private Optional<Integer> makeMovesTimeoutMillis;
        private Optional<Integer> initialiseTimeoutMillis;
        private Optional<Double> foodSpawnProbability;
        private Optional<Integer> battleRadius;
        private Optional<Integer> maxFoodSpawnedPerTurn;
        private Optional<Integer> minFoodDistanceFromSpawn;
        private Optional<Integer> initialUnitCount;
        private Optional<Integer> viewDistance;
        private Optional<Integer> maximumFoodCount;

        GameConfigLayerImpl(
            Optional<Integer> turnLimit,
            Optional<Integer> makeMovesTimeoutMillis,
            Optional<Integer> initialiseTimeoutMillis,
            Optional<Double> foodSpawnProbability,
            Optional<Integer> battleRadius,
            Optional<Integer> maxFoodSpawnedPerTurn,
            Optional<Integer> minFoodDistanceFromSpawn,
            Optional<Integer> spawnPhases,
            Optional<Integer> viewDistance,
            Optional<Integer> maximumFoodCount) {

            this.turnLimit = turnLimit;
            this.makeMovesTimeoutMillis = makeMovesTimeoutMillis;
            this.initialiseTimeoutMillis = initialiseTimeoutMillis;
            this.foodSpawnProbability = foodSpawnProbability;
            this.battleRadius = battleRadius;
            this.maxFoodSpawnedPerTurn = maxFoodSpawnedPerTurn;
            this.minFoodDistanceFromSpawn = minFoodDistanceFromSpawn;
            this.initialUnitCount = spawnPhases;
            this.viewDistance = viewDistance;
            this.maximumFoodCount = maximumFoodCount;
        }

        @Override
        public Optional<Integer> getTurnLimit() {
            return turnLimit;
        }

        @Override
        public Optional<Integer> getMakeMovesTimeoutMillis() {
            return makeMovesTimeoutMillis;
        }

        @Override
        public Optional<Integer> getInitialiseTimeoutMillis() {
            return initialiseTimeoutMillis;
        }

        @Override
        public Optional<Double> getFoodSpawnProbability() {
            return foodSpawnProbability;
        }

        @Override
        public Optional<Integer> getBattleRadius() {
            return battleRadius;
        }

        @Override
        public Optional<Integer> getMaxFoodSpawnedPerTurn() {
            return maxFoodSpawnedPerTurn;
        }

        @Override
        public Optional<Integer> getMinFoodDistanceFromSpawn() {
            return minFoodDistanceFromSpawn;
        }

        @Override
        public Optional<Integer> getInitialUnitCount() {
            return initialUnitCount;
        }

        @Override
        public Optional<Integer> getViewDistance() {
            return viewDistance;
        }

        @Override
        public Optional<Integer> getMaximumFoodCount() {
            return maximumFoodCount;
        }
    }
}
