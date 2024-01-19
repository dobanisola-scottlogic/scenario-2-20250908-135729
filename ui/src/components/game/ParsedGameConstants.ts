import { Cell } from '~/interfaces/Cell';
import { GameResult } from '~/interfaces/GameResult';
import { GameTeam } from '~/interfaces/GameTeam';
import { Position } from '~/interfaces/Position';
import { SpawnPoint } from '~/interfaces/SpawnPoint';
import { SpawnPointWithCell } from '~/interfaces/SpawnPointWithCell';
import { Colours } from '~/utils/colours';

export class ParsedGameConstants {
  private constructor(
    public readonly cutoffCondition: string,
    public readonly height: number,
    public readonly id: string,
    public readonly outOfBoundPositions: Position[],
    public readonly spawnPoints: SpawnPointWithCell[],
    public readonly teams: GameTeam[],
    public readonly width: number
  ) {}

  public static parse = (gameResult: GameResult): ParsedGameConstants => {
    if (!gameResult) {
      throw 'No gameResult';
    }

    const teams: GameTeam[] = gameResult.game.teams.map((team, index) => {
      return {
        botId: team.botId,
        colour: Colours.get(index),
        teamId: team.teamId,
        teamName: team.teamName,
      };
    });

    const spawnPoints: SpawnPointWithCell[] = [];

    gameResult.spawnPoints.forEach((spawnPoint: SpawnPoint, index: number) => {
      spawnPoints.push({
        cell: new Cell(spawnPoint.position.x, spawnPoint.position.y),
        id: spawnPoint.id,
        owner: spawnPoint.owner,
        teamIndex: index,
      });
    });

    return new ParsedGameConstants(
      gameResult.cutoffCondition.toString(),
      gameResult.game.map.height,
      gameResult.id,
      gameResult.game.map.outOfBoundPositions,
      spawnPoints,
      teams,
      gameResult.game.map.width
    );
  };
}
