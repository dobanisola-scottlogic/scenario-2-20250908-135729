import { PlayerTravel } from '~/components/game/PlayerTravel';
import PlayerMovementUtils, { PlayerMovement } from '~/enums/PlayerMovement';
import { Cell } from '~/interfaces/Cell';
import { Collectable } from '~/interfaces/Collectable';
import { GameResult } from '~/interfaces/GameResult';
import { Player } from '~/interfaces/Player';
import { PlayerPosition } from '~/interfaces/PlayerPosition';

export class ParsedGameDelta {
  private constructor(
    public readonly collectablesAdded: Collectable[],
    public readonly collectablesCollected: number[],
    public readonly playersAdded: Player[],
    public readonly playersDestroyed: number[],
    public readonly playersTravel: Map<number, PlayerTravel>,
    public readonly spawnPointsDestroyed: number[]
  ) {}

  private static checkBoundary = (value: number): boolean => {
    return value > 1 || value < -1;
  };

  private static parseAddedPlayers = (
    phaseIndex: number,
    gameData: GameResult
  ): Player[] => {
    const playersAdded: Player[] = [];

    const phaseResult = gameData.phaseResults[phaseIndex];

    phaseResult.addedPlayers.forEach((addedPlayer) => {
      const playerPosition = phaseResult.playerPositions.find(
        (pp) => pp.id === addedPlayer.id
      );

      if (!playerPosition) {
        throw `No PlayerPosition found for Added Player id=${addedPlayer.id} in Phase id=${phaseResult.id}`;
      }

      const teamIndex = gameData.game.teams.findIndex(
        (t) => t.botId === addedPlayer.owner
      );

      playersAdded.push({
        cell: new Cell(playerPosition.position.x, playerPosition.position.y),
        id: addedPlayer.id,
        owner: addedPlayer.owner,
        teamIndex,
      });
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
    return gameData.phaseResults[index].removedSpawnPoints;
  };

  private static parsePlayerMovements = (
    index: number,
    gameData: GameResult
  ): Map<number, PlayerTravel> => {
    const movements = new Map<number, PlayerTravel>();

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
          movements.set(
            playerPosition.id,
            new PlayerTravel(
              PlayerMovement.STATIONARY,
              playerPosition.position,
              false
            )
          );
        } else {
          let xMovement =
            playerPosition.position.x -
            gameData.phaseResults[index - 1].playerPositions[idIndex].position
              .x;

          let yMovement =
            playerPosition.position.y -
            gameData.phaseResults[index - 1].playerPositions[idIndex].position
              .y;

          const hasWrappedAroundMap =
            this.checkBoundary(xMovement) || this.checkBoundary(yMovement);

          // Handle the wrapping of the map:
          xMovement = xMovement > 1 ? -1 : xMovement;
          xMovement = xMovement < -1 ? 1 : xMovement;
          yMovement = yMovement > 1 ? -1 : yMovement;
          yMovement = yMovement < -1 ? 1 : yMovement;

          const playerMovement = PlayerMovementUtils.calculatePlayerMovement(
            xMovement,
            yMovement
          );

          movements.set(
            playerPosition.id,
            new PlayerTravel(
              playerMovement,
              playerPosition.position,
              hasWrappedAroundMap
            )
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
