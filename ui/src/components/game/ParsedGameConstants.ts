import { SpawnPoint } from '~/components/game/SpawnPoint';
import { GameResult } from '~/interfaces/GameResult';
import { GameTeam } from '~/interfaces/GameTeam';
import { Position } from '~/interfaces/Position';
import { SpawnPointData } from '~/interfaces/SpawnPointData';
import { Colours } from '~/utils/colours';

export class ParsedGameConstants {
  private constructor(
    public readonly cutoffCondition: string,
    public readonly height: number,
    public readonly id: string,
    public readonly outOfBoundPositions: Position[],
    public readonly spawnPoints: SpawnPoint[],
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

    const spawnPoints: SpawnPoint[] = [];

    gameResult.spawnPoints.forEach((spawnPoint: SpawnPointData) => {
      const teamIndex = gameResult.game.teams.findIndex(
        (t) => t.botId === spawnPoint.owner
      );

      if (teamIndex < 0) {
        throw `Unable to determine an owning team for SpawnPoint with id=${spawnPoint.id} and owner=${spawnPoint.owner}`;
      }

      spawnPoints.push(
        new SpawnPoint(
          spawnPoint.id,
          spawnPoint.owner,
          spawnPoint.position,
          teamIndex
        )
      );
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
