package com.scottlogic.hackathon.bots.state;

import com.scottlogic.hackathon.bots.move.*;
import com.scottlogic.hackathon.game.Direction;
import com.scottlogic.hackathon.game.Player;

import java.lang.reflect.Constructor;
import java.lang.reflect.InvocationTargetException;
import java.util.HashMap;
import java.util.Map;

public class ProportionalTransitionSelector {

    private final HashMap<Class, Integer> desiredProportionsMap = createDesiredProportionsMap();

    private static HashMap<Class, Integer> createDesiredProportionsMap() {
        HashMap<Class, Integer> desiredProportionsMap = new HashMap<>();
        desiredProportionsMap.put(AttackMove.class, 20);
        desiredProportionsMap.put(CollectableMove.class, 80);
        desiredProportionsMap.put(DefendMove.class, 0);
        desiredProportionsMap.put(HunterMove.class, 10);
        desiredProportionsMap.put(TimidMove.class, 0);
        return desiredProportionsMap;
    }

    private MoveBase move;

    public ProportionalTransitionSelector(Map<Class, Integer> moveCounts, MoveBase move, int mapWidth, int mapHeight, Player player) throws InvocationTargetException, NoSuchMethodException, InstantiationException, IllegalAccessException {
        this.move = findMinimumSquaresSolution(moveCounts, desiredProportionsMap, move, mapWidth, mapHeight, player);
    }

    private MoveBase findMinimumSquaresSolution(Map<Class, Integer> moveCounts, HashMap<Class, Integer> desiredProportionsMap, MoveBase move, int mapWidth, int mapHeight, Player player) throws IllegalAccessException, InvocationTargetException, InstantiationException, NoSuchMethodException {
        double minimumSquaresValue = 0;
        Class moveClass = null;
        for (Class clazz : desiredProportionsMap.keySet()) {
            minimumSquaresValue += Math.pow(desiredProportionsMap.get(clazz), 2);
        }

        for (Class outerClazzIteration : moveCounts.keySet()) {
            double currentSquaresValue = 0;
            for (Class innerClazzIteration : moveCounts.keySet()) {
                if (outerClazzIteration == innerClazzIteration) {
                    currentSquaresValue += Math.pow((moveCounts.get(innerClazzIteration) + 1 - desiredProportionsMap.get(innerClazzIteration)), 2);
                } else {
                    currentSquaresValue += Math.pow((moveCounts.get(innerClazzIteration) - desiredProportionsMap.get(innerClazzIteration)), 2);
                }
                ;
            }
            if (currentSquaresValue < minimumSquaresValue) {
                moveClass = outerClazzIteration;
                minimumSquaresValue = currentSquaresValue;
            }
        }

        if (moveClass != null) {
            Constructor constructor = moveClass.getConstructor(Direction.class, int.class, int.class, int.class, Player.class);
            return (MoveBase) constructor.newInstance(move.getDirection(), move.getDistance(), mapWidth, mapHeight, player);
        } else {
            RandomStateSelector randomStateSelector = new RandomStateSelector(mapWidth, mapHeight, player);
            return randomStateSelector.getMove();
        }
    }

    public MoveBase getMove() {
        return move;
    }

}
