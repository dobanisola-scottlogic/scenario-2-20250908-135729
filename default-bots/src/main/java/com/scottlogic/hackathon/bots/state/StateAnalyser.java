package com.scottlogic.hackathon.bots.state;

import com.scottlogic.hackathon.bots.move.*;
import com.scottlogic.hackathon.game.*;

import java.lang.reflect.InvocationTargetException;
import java.util.HashMap;
import java.util.Set;

public class StateAnalyser {

    private final GameGeometry map;

    private Player player;
    private ProportionalTransitionSelector proportionalTransitionSelector = null;
    private ProportionalStateSelector proportionalStateSelector = null;
    private HashMap<Class, Integer> spawnProfile;
    private HashMap<Class, Integer> transitionProfile;
    private java.util.Map<Class, Integer> moveCounts;

    public StateAnalyser(GameState gameState, Set<Position> playerPositions, Set<Position> opponentPlayerPositions,
                         Set<Position> outOfBoundsPositions, SpawnPoint spawnPoint, Set<SpawnPoint> opponentSpawnPoints,
                         Set<Collectable> collectables) {
        this.map = gameState.getMap();
        setProfilesFromGamestate(gameState,
                playerPositions,
                opponentPlayerPositions,
                outOfBoundsPositions,
                spawnPoint,
                opponentSpawnPoints,
                collectables);
    }

    private void setProfilesFromGamestate(GameState gameState,
                                          Set<Position> playerPositions,
                                          Set<Position> opponentPlayerPositions,
                                          Set<Position> outOfBoundsPositions,
                                          SpawnPoint spawnPoint,
                                          Set<SpawnPoint> opponentSpawnPoints,
                                          Set<Collectable> collectables) {
        String stateType = getStateTypeFromGamestate(gameState,
                playerPositions,
                opponentPlayerPositions,
                outOfBoundsPositions,
                spawnPoint,
                opponentSpawnPoints,
                collectables);
        switch (stateType) {
            case "Hide":
                this.spawnProfile = new HashMap<>();
                this.spawnProfile.put(AttackMove.class, 0);
                this.spawnProfile.put(CollectableMove.class, 0);
                this.spawnProfile.put(DefendMove.class, 0);
                this.spawnProfile.put(HunterMove.class, 0);
                this.spawnProfile.put(TimidMove.class, 10);
                this.transitionProfile = new HashMap<>();
                this.transitionProfile.put(AttackMove.class, 0);
                this.transitionProfile.put(CollectableMove.class, 0);
                this.transitionProfile.put(DefendMove.class, 0);
                this.transitionProfile.put(HunterMove.class, 0);
                this.transitionProfile.put(TimidMove.class, 10);
                break;
            case "Explore":
                this.spawnProfile = new HashMap<>();
                this.spawnProfile.put(AttackMove.class, 0);
                this.spawnProfile.put(CollectableMove.class, 80);
                this.spawnProfile.put(DefendMove.class, 0);
                this.spawnProfile.put(HunterMove.class, 0);
                this.spawnProfile.put(TimidMove.class, 0);
                this.transitionProfile = new HashMap<>();
                this.transitionProfile.put(AttackMove.class, 0);
                this.transitionProfile.put(CollectableMove.class, 80);
                this.transitionProfile.put(DefendMove.class, 0);
                this.transitionProfile.put(HunterMove.class, 0);
                this.transitionProfile.put(TimidMove.class, 0);
                break;
            case "Predator":
                this.spawnProfile = new HashMap<>();
                this.spawnProfile.put(AttackMove.class, 80);
                this.spawnProfile.put(CollectableMove.class, 80);
                this.spawnProfile.put(DefendMove.class, 0);
                this.spawnProfile.put(HunterMove.class, 10);
                this.spawnProfile.put(TimidMove.class, 0);
                this.transitionProfile = new HashMap<>();
                this.transitionProfile.put(AttackMove.class, 80);
                this.transitionProfile.put(CollectableMove.class, 80);
                this.transitionProfile.put(DefendMove.class, 0);
                this.transitionProfile.put(HunterMove.class, 0);
                this.transitionProfile.put(TimidMove.class, 0);
                break;
            case "SpawnPointAttack":
                this.spawnProfile = new HashMap<>();
                this.spawnProfile.put(AttackMove.class, 0);
                this.spawnProfile.put(CollectableMove.class, 80);
                this.spawnProfile.put(DefendMove.class, 0);
                this.spawnProfile.put(HunterMove.class, 80);
                this.spawnProfile.put(TimidMove.class, 0);
                this.transitionProfile = new HashMap<>();
                this.transitionProfile.put(AttackMove.class, 0);
                this.transitionProfile.put(CollectableMove.class, 80);
                this.transitionProfile.put(DefendMove.class, 0);
                this.transitionProfile.put(HunterMove.class, 80);
                this.transitionProfile.put(TimidMove.class, 0);
                break;
            default:
                this.spawnProfile = new HashMap<>();
                this.spawnProfile.put(AttackMove.class, 20);
                this.spawnProfile.put(CollectableMove.class, 80);
                this.spawnProfile.put(DefendMove.class, 0);
                this.spawnProfile.put(HunterMove.class, 10);
                this.spawnProfile.put(TimidMove.class, 0);
                this.transitionProfile = new HashMap<>();
                this.transitionProfile.put(AttackMove.class, 0);
                this.transitionProfile.put(CollectableMove.class, 80);
                this.transitionProfile.put(DefendMove.class, 0);
                this.transitionProfile.put(HunterMove.class, 0);
                this.transitionProfile.put(TimidMove.class, 0);
                break;
        }
    }

    private String getStateTypeFromGamestate(GameState gameState,
                                             Set<Position> playerPositions,
                                             Set<Position> opponentPlayerPositions,
                                             Set<Position> outOfBoundsPositions,
                                             SpawnPoint spawnPoint,
                                             Set<SpawnPoint> opponentSpawnPoints,
                                             Set<Collectable> collectables) {
        // Analyse what the state is, and return it.
        if (spawnPoint == null) {
            return "Hide";
        }
        if (gameState.getPhase() < 50) {
            return "Explore";
        }
        if (playerPositions.size() > opponentPlayerPositions.size()) {
            return "Predator";
        }
        if (opponentSpawnPoints.size() > 0) {
            return "SpawnPointAttack";
        }
        return "";
    }

    public void setPlayer(Player player) {
        this.player = player;
    }

    public MoveBase getMove() {
        return proportionalTransitionSelector == null ?
                proportionalStateSelector.getMove() :
                proportionalTransitionSelector.getMove();
    }

    public void setMove(MoveBase move) throws NoSuchMethodException, InstantiationException, IllegalAccessException, InvocationTargetException {
        if (move == null) {
            proportionalTransitionSelector = null;
            proportionalStateSelector = new ProportionalStateSelector(moveCounts, spawnProfile, map, player);
        } else {
            proportionalStateSelector = null;
            proportionalTransitionSelector = new ProportionalTransitionSelector(moveCounts, transitionProfile, map, move, player);
        }
    }

    public void setMoveCounts(java.util.Map<Class, Integer> moveCounts) {
        this.moveCounts = moveCounts;
    }
}
