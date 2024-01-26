import PlayerMovementUtils, { PlayerMovement } from '~/enums/PlayerMovement';
import { Cell } from '~/interfaces/Cell';
import { Collectable } from '~/interfaces/Collectable';
import { GameResult } from '~/interfaces/GameResult';
import { Player } from '~/interfaces/Player';
import { PlayerPosition } from '~/interfaces/PlayerPosition';
import { SpawnPoint } from '~/interfaces/SpawnPoint';

const spawnPoints: SpawnPoint[] = [];

export class ParsedGameDelta {
  collectablesAdded: Collectable[] = [];
  collectablesCollected: number[] = [];
  playerMovement: Map<number, PlayerMovement> = new Map<
    number,
    PlayerMovement
  >();
  playersAdded: Player[] = [];
  playersDestroyed: number[] = [];
  spawnPointsDestroyed: number[];

  private constructor(
    collectablesAdded: Collectable[],
    collectablesCollected: number[],
    playersAdded: Player[],
    playersDestroyed: number[],
    playersMovements: Map<number, PlayerMovement>,
    spawnPointsDestroyed: number[]
  ) {
    this.collectablesAdded = collectablesAdded;
    this.collectablesCollected = collectablesCollected;
    this.playerMovement = playersMovements;
    this.playersAdded = playersAdded;
    this.playersDestroyed = playersDestroyed;
    this.spawnPointsDestroyed = spawnPointsDestroyed;
  }

  private static initialiseSpawnPoints = (gameData: GameResult) => {
    gameData.spawnPoints.forEach((spawnPoint, spawnIndex) => {
      spawnPoints.push({
        id: spawnPoint.id,
        owner: spawnPoint.owner,
        position: spawnPoint.position,
        teamIndex: spawnIndex,
      });
    });
  };

  private static parseAddedPlayers = (
    index: number,
    gameData: GameResult
  ): Player[] => {
    const playersAdded: Player[] = [];
    let idsOfPreviousPlayers: number[] = [];

    if (index > 0) {
      idsOfPreviousPlayers = gameData.phaseResults[
        index - 1
      ].playerPositions.map((playerPosition) => playerPosition.id);
    }

    gameData.phaseResults[index].playerPositions.forEach((playerPosition) => {
      if (
        index === 0 ||
        idsOfPreviousPlayers.indexOf(playerPosition.id) === -1
      ) {
        let teamIndex = -1;

        const indexOfAddedPlayer = gameData.phaseResults[
          index
        ].addedPlayers.findIndex((player) => player.id === playerPosition.id);

        const owner =
          gameData.phaseResults[index].addedPlayers[indexOfAddedPlayer].owner;

        spawnPoints.forEach((spawnPoint) => {
          if (spawnPoint.owner === owner) {
            teamIndex = spawnPoint.teamIndex;
          }
        });

        playersAdded.push({
          cell: new Cell(playerPosition.position.x, playerPosition.position.y),
          id: playerPosition.id,
          owner: owner,
          teamIndex: teamIndex,
        });
      }
    });

    return playersAdded;
  };

  private static parseCollectablesAdded = (
    index: number,
    gameData: GameResult
  ): Collectable[] => {
    return gameData.phaseResults[index].addedCollectables;
  };

  private static parseCollectablesCollected = (
    index: number,
    gameData: GameResult
  ): number[] => {
    return gameData.phaseResults[index].removedCollectables;
  };

  private static parseDestroyedPlayers = (
    index: number,
    gameData: GameResult
  ): number[] => {
    return gameData.phaseResults[index].removedPlayers;
  };

  private static parseDestroyedSpawnPoints = (
    index: number,
    gameData: GameResult
  ): number[] => {
    return gameData.phaseResults[index].removedSpawnPoints.map(
      (spawnPoint) => spawnPoint.id
    );
  };

  private static parsePlayerMovements = (
    index: number,
    gameData: GameResult
  ): Map<number, PlayerMovement> => {
    const movements = new Map<number, PlayerMovement>();

    gameData.phaseResults[index].playerPositions.forEach(
      (playerPosition: PlayerPosition) => {
        let idIndex = -1;

        if (index !== 0) {
          idIndex = gameData.phaseResults[index - 1].playerPositions.findIndex(
            (position) => position.id === playerPosition.id
          );
        }

        if (idIndex === -1) {
          // If index = 0, every player should be treated as a spawn:
          movements.set(playerPosition.id, PlayerMovement.STATIONARY);
        } else {
          let xMovement =
            playerPosition.position.x -
            gameData.phaseResults[index - 1].playerPositions[idIndex].position
              .x;
          let yMovement =
            playerPosition.position.y -
            gameData.phaseResults[index - 1].playerPositions[idIndex].position
              .y;

          // Handle the wrapping of the map:
          xMovement = xMovement > 1 ? -1 : xMovement;
          xMovement = xMovement < -1 ? 1 : xMovement;
          yMovement = yMovement > 1 ? -1 : yMovement;
          yMovement = yMovement < -1 ? 1 : yMovement;

          movements.set(
            playerPosition.id,
            PlayerMovementUtils.calculatePlayerMovement(xMovement, yMovement)
          );
        }
      }
    );

    return movements;
  };

  public static parseMany = (gameData: GameResult): ParsedGameDelta[] => {
    if (!gameData) {
      throw 'No gameData';
    }

    this.initialiseSpawnPoints(gameData);

    const deltas: ParsedGameDelta[] = [];

    for (let i = 0; i < gameData.phaseResults.length; i++) {
      const collectablesAdded = this.parseCollectablesAdded(i, gameData);
      const collectablesCollected = this.parseCollectablesCollected(
        i,
        gameData
      );
      const playersAdded = this.parseAddedPlayers(i, gameData);
      const playersDestroyed = this.parseDestroyedPlayers(i, gameData);
      const playersMovements = this.parsePlayerMovements(i, gameData);
      const spawnPointsDestroyed = this.parseDestroyedSpawnPoints(i, gameData);

      const delta = new ParsedGameDelta(
        collectablesAdded,
        collectablesCollected,
        playersAdded,
        playersDestroyed,
        playersMovements,
        spawnPointsDestroyed
      );

      deltas.push(delta);
    }

    return deltas;
  };
}
