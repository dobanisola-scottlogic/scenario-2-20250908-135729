package com.contestantbots.util;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import com.scottlogic.hackathon.game.*;

public class GameStateLogger {
  private static Id botId;

  public static class GameStateLoggerBuilder {
    private Boolean logOutOfBounds;
    private Boolean logSpawnPoints;
    private Boolean logCollectables;
    private Boolean logPlayers;

    public GameStateLoggerBuilder() {
      this.logOutOfBounds = false;
      this.logSpawnPoints = false;
      this.logCollectables = false;
      this.logPlayers = false;
    }

    public GameStateLoggerBuilder withOutOfBounds() {
      this.logOutOfBounds = true;
      return this;
    }

    public GameStateLoggerBuilder withSpawnPoints() {
      this.logSpawnPoints = true;
      return this;
    }

    public GameStateLoggerBuilder withCollectables() {
      this.logCollectables = true;
      return this;
    }

    public GameStateLoggerBuilder withPlayers() {
      this.logPlayers = true;
      return this;
    }

    public void process(GameState gameState) {
      StringBuilder output = new StringBuilder();

      output.append(separator(true));
      output.append("\n" + "turn: " + gameState.getPhase());

      if (logOutOfBounds) {
        output.append(separator(true));
        output.append("\n").append(renderOutOfBounds(gameState));
      }

      if (logSpawnPoints) {
        output.append(separator(true));
        output.append("\n").append(renderSpawnPoints(gameState));
      }

      if (logPlayers) {
        output.append(separator(true));
        output.append("\n").append(renderPlayers(gameState));
      }

      if (logCollectables) {
        output.append(separator(true));
        output.append("\n").append(renderCollectables(gameState));
      }

      output.append("\n" + "\n");
      System.out.println(output);
    }
  }

  private GameStateLogger(Id botId) {
    this.botId = botId;
  }

  public static GameStateLoggerBuilder configure(Id botId) {
    new GameStateLogger(botId);
    return new GameStateLoggerBuilder();
  }

  private static StringBuilder renderOutOfBounds(GameState gameState) {
    StringBuilder outOfBoundsOutput = new StringBuilder("Out of Bounds: ");
    Set<Position> outOfBounds = gameState.getOutOfBoundsPositions();
    if (outOfBounds.isEmpty()) {
      outOfBoundsOutput.append("none visible");
    } else {
      outOfBounds.forEach(outOfBound -> outOfBoundsOutput.append("\n").append(outOfBound));
    }
    return outOfBoundsOutput;
  }

  private static StringBuilder renderCollectables(GameState gameState) {
    StringBuilder collectablesOutput = new StringBuilder("Collectables: ");
    Set<Collectable> collectables = gameState.getCollectables();
    if (collectables.isEmpty()) {
      collectablesOutput.append("none visible");
    } else {
      collectables.forEach(collectable -> collectablesOutput.append("\n").append(collectable));
    }
    return collectablesOutput;
  }

  private static StringBuilder renderSpawnPoints(GameState gameState) {
    StringBuilder spawnPointsOutput = new StringBuilder("SpawnPoints");

    List<SpawnPoint> friendlySpawnPoints =
        gameState.getSpawnPoints().stream()
            .filter(spawnPoint -> spawnPoint.getOwner().equals(botId))
            .collect(Collectors.toList());
    List<SpawnPoint> enemySpawnPoints =
        gameState.getSpawnPoints().stream()
            .filter(spawnPoint -> !spawnPoint.getOwner().equals(botId))
            .collect(Collectors.toList());
    Set<SpawnPoint> removedSpawnPoints = gameState.getRemovedSpawnPoints();

    StringBuilder friendly = new StringBuilder("Friendly: ");
    if (friendlySpawnPoints.isEmpty()) {
      friendly.append("none");
    } else {
      friendlySpawnPoints.forEach(spawnPoint -> friendly.append("\n").append(spawnPoint));
    }
    spawnPointsOutput.append("\n").append(friendly);
    spawnPointsOutput.append(separator(false));
    StringBuilder enemy = new StringBuilder("Enemy: ");
    if (enemySpawnPoints.isEmpty()) {
      enemy.append("none visible");
    } else {
      enemySpawnPoints.forEach(spawnPoint -> enemy.append("\n").append(spawnPoint));
    }
    spawnPointsOutput.append("\n").append(enemy);
    spawnPointsOutput.append(separator(false));
    StringBuilder removed = new StringBuilder("Removed: ");
    if (removedSpawnPoints.isEmpty()) {
      removed.append("none");
    } else {
      removedSpawnPoints.forEach(spawnPoint -> removed.append("\n").append(spawnPoint));
    }
    spawnPointsOutput.append("\n").append(removed);

    return spawnPointsOutput;
  }

  private static StringBuilder renderPlayers(GameState gameState) {
    List<Player> friendlyPlayers =
        gameState.getPlayers().stream()
            .filter(player -> player.getOwner().equals(botId))
            .collect(Collectors.toList());
    List<Player> enemyPlayers =
        gameState.getPlayers().stream()
            .filter(player -> !player.getOwner().equals(botId))
            .collect(Collectors.toList());
    Set<Player> removedPlayers = gameState.getRemovedPlayers();

    StringBuilder playersOutput = new StringBuilder("Players");

    StringBuilder friendly = new StringBuilder("Friendly: ");
    if (friendlyPlayers.isEmpty()) {
      friendly.append("none");
    } else {
      friendlyPlayers.forEach(player -> friendly.append("\n").append(player));
    }
    playersOutput.append("\n").append(friendly);
    playersOutput.append(separator(false));
    StringBuilder enemy = new StringBuilder("Enemy: ");
    if (enemyPlayers.isEmpty()) {
      enemy.append("none visible");
    } else {
      enemyPlayers.forEach(player -> enemy.append("\n").append(player));
    }
    playersOutput.append("\n").append(enemy);
    playersOutput.append(separator(false));
    StringBuilder removed = new StringBuilder("Removed: ");
    if (removedPlayers.isEmpty()) {
      removed.append("none");
    } else {
      removedPlayers.forEach(player -> removed.append("\n").append(player));
    }
    playersOutput.append("\n").append(removed);

    return playersOutput;
  }

  private static String separator(boolean section) {
    if (section) {
      return "\n"
          + "====================================================================================================";
    } else {
      return "\n"
          + "----------------------------------------------------------------------------------------------------";
    }
  }
}
