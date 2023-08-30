package com.scottlogic.hackathon.game.engine.models;

import lombok.Value;

import com.scottlogic.hackathon.game.*;

@Value
public class PhaseResultImpl implements PhaseResult {
  int phase;
  TrackedSet<Player> players;
  TrackedSet<SpawnPoint> spawnPoints;
  TrackedSet<Collectable> collectables;
  TrackedSet<DisqualifiedBot> disqualifiedBots;
}
