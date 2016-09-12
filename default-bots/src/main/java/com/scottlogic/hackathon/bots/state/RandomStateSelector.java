package com.scottlogic.hackathon.bots.state;

import com.scottlogic.hackathon.bots.move.*;
import com.scottlogic.hackathon.game.Player;

import java.util.Random;
import java.util.stream.IntStream;

public class RandomStateSelector {

    private final static int ATTACK = 20;
    private final static int COLLECTABLE = 80;
    private final static int DEFEND = 0;
    private final static int HUNTER = 10;
    private final static int TIMID = 0;
    private final static int[] STATEPROPORTIONS = new int[]{ATTACK, COLLECTABLE, DEFEND, HUNTER, TIMID};

    private MoveBase move;

    public RandomStateSelector(int mapWidth, int mapHeight, Player player) {
        // Determines which bot is selected
        int stateProportionsSum = IntStream.of(STATEPROPORTIONS).sum();
        int randomState = new Random().nextInt(stateProportionsSum);
        if (randomState < STATEPROPORTIONS[0]) {
            this.move = new AttackMove(mapWidth, mapHeight, player);
        } else if (randomState < STATEPROPORTIONS[0] + STATEPROPORTIONS[1]) {
            this.move = new CollectableMove(mapWidth, mapHeight, player);
        } else if (randomState < STATEPROPORTIONS[0] + STATEPROPORTIONS[1] + STATEPROPORTIONS[2]) {
            this.move = new DefendMove(mapWidth, mapHeight, player);
        } else if (randomState < STATEPROPORTIONS[0] + STATEPROPORTIONS[1] + STATEPROPORTIONS[2] + STATEPROPORTIONS[3]) {
            this.move = new HunterMove(mapWidth, mapHeight, player);
        } else {
            this.move = new TimidMove(mapWidth, mapHeight, player);
        }
    }

    public MoveBase getMove() {
        return move;
    }

}
