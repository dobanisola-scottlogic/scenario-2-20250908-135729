package com.scottlogic.hackathon.bots.state;

import com.scottlogic.hackathon.bots.move.MoveBase;
import com.scottlogic.hackathon.game.GameGeometry;
import com.scottlogic.hackathon.game.Player;

import java.lang.reflect.Constructor;
import java.lang.reflect.InvocationTargetException;
import java.util.HashMap;

public class ProportionalStateSelector {

    private MoveBase move;

    public ProportionalStateSelector(java.util.Map<Class, Integer> moveCounts, HashMap<Class, Integer> spawnProfile,
            GameGeometry map, Player player)
            throws InvocationTargetException, NoSuchMethodException, InstantiationException, IllegalAccessException {
        this.move = findMinimumSquaresSolution(moveCounts, spawnProfile, map, player);
    }

    private MoveBase findMinimumSquaresSolution(java.util.Map<Class, Integer> moveCounts,
            HashMap<Class, Integer> desiredProportionsMap, GameGeometry map, Player player)
            throws IllegalAccessException, InvocationTargetException, InstantiationException, NoSuchMethodException {
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
            }
            if (currentSquaresValue < minimumSquaresValue) {
                moveClass = outerClazzIteration;
                minimumSquaresValue = currentSquaresValue;
            }
        }

        if (moveClass != null) {
            Constructor constructor = moveClass.getConstructor(GameGeometry.class, Player.class);
            return (MoveBase) constructor.newInstance(map, player);
        } else {
            RandomStateSelector randomStateSelector = new RandomStateSelector(map, player);
            return randomStateSelector.getMove();
        }
    }

    public MoveBase getMove() {
        return move;
    }

}
