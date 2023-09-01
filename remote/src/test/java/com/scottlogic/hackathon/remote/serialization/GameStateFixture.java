package com.scottlogic.hackathon.remote.serialization;

import java.util.HashSet;
import java.util.Set;
import java.util.concurrent.atomic.AtomicLong;

import com.scottlogic.hackathon.game.*;

public class GameStateFixture {
  IdGenerator IdGenerator = new IdGenerator();

  Id playerId = IdGenerator.next();
  Id owner = UniqueIdGenerator.INSTANCE.next();
  Id removedPlayerId = IdGenerator.next();
  Id removedSpawnPointOwner = UniqueIdGenerator.INSTANCE.next();

  public final GameState gameState = createTestGameState();
  public final String gameStateJson = createTestGameStateJson();

  public GameState createTestGameState() {
    GameGeometry gameMap = new LoopingQuadsGameGeometry(100, 100);

    Set<Position> outOfBoundsPositions = new HashSet<>();
    outOfBoundsPositions.add(new Position(35, 14));

    Position playerPosition = new Position(35, 14);
    Player player = new Player(playerId, owner, playerPosition);
    Set<Player> players = new HashSet<>();
    players.add(player);

    Position removedPlayerPosition = new Position(15, 60);
    Player removedPlayer = new Player(removedPlayerId, owner, removedPlayerPosition);
    Set<Player> removedPlayers = new HashSet<>();
    removedPlayers.add(removedPlayer);

    Position spawnPointPosition = new Position(23, 46);
    SpawnPoint spawnPoint = new SpawnPoint(IdGenerator.next(), spawnPointPosition, owner, 2);
    Set<SpawnPoint> spawnPoints = new HashSet<>();
    spawnPoints.add(spawnPoint);

    Position removedSpawnPointPosition = new Position(23, 46);
    SpawnPoint removedSpawnPoint =
        new SpawnPoint(IdGenerator.next(), removedSpawnPointPosition, removedSpawnPointOwner, 2);
    Set<SpawnPoint> removedSpawnPoints = new HashSet<>();
    removedSpawnPoints.add(removedSpawnPoint);

    Collectable.Type type = Collectable.Type.PLAYER;
    Position collectablePosition = new Position(2, 86);
    Collectable collectable = new Collectable(IdGenerator.next(), type, collectablePosition);
    Set<Collectable> collectables = new HashSet<>();
    collectables.add(collectable);

    GameState gameState =
        new GameState(
            0,
            gameMap,
            outOfBoundsPositions,
            players,
            removedPlayers,
            spawnPoints,
            removedSpawnPoints,
            collectables);

    return gameState;
  }

  private String createTestGameStateJson() {
    Id spawnPointId = gameState.getSpawnPoints().stream().findFirst().get().getId();
    Id removedSpawnPointId = gameState.getRemovedSpawnPoints().stream().findFirst().get().getId();
    Id collectableId = gameState.getCollectables().stream().findFirst().get().getId();

    String gameStateJson =
        "{"
            + "\"phase\":0,"
            + "\"map\":{\"width\":100,\"height\":100,\"allPositions\":{\"parallel\":false}},"
            + "\"outOfBoundsPositions\":[{\"x\":35,\"y\":14}],"
            + "\"players\":["
            + "{\"id\":"
            + playerId.getId()
            + ",\"owner\":"
            + owner
            + ",\"position\":{\"x\":35,\"y\":14}}"
            + "],"
            + "\"removedPlayers\":["
            + "{\"id\":"
            + removedPlayerId.getId()
            + ",\"owner\":"
            + owner
            + ",\"position\":{\"x\":15,\"y\":60}}"
            + "],"
            + "\"spawnPoints\":["
            + "{\"id\":"
            + spawnPointId.getId()
            + ",\"position\":{\"x\":23,\"y\":46},\"owner\":"
            + owner
            + "}"
            + "],"
            + "\"removedSpawnPoints\":["
            + "{\"id\":"
            + removedSpawnPointId.getId()
            + ",\"position\":{\"x\":23,\"y\":46},\"owner\":"
            + removedSpawnPointOwner
            + "}"
            + "],"
            + "\"collectables\":["
            + "{\"id\":"
            + collectableId.getId()
            + ",\"type\":\"PLAYER\",\"position\":{\"x\":2,\"y\":86}}"
            + "]"
            + "}";

    return gameStateJson;
  }

  class IdGenerator {

    AtomicLong lastId = new AtomicLong();

    Id next() {
      return new Id(lastId.incrementAndGet());
    }
  }
}
