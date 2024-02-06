import { SpawnPoint } from '~/components/game/SpawnPoint';
import { TeamInfo } from '~/components/game/TeamInfo';
import { Cell } from '~/interfaces/Cell';
import { Collectable } from '~/interfaces/Collectable';
import { DisqualifiedBot } from '~/interfaces/DisqualifiedBot';
import { GameResult } from '~/interfaces/GameResult';
import { PhaseResult } from '~/interfaces/PhaseResult';
import { Player } from '~/interfaces/Player';

export class ParsedGameState {
  private constructor(
    public readonly collectables: Collectable[],
    public readonly players: Player[],
    public readonly spawnPoints: SpawnPoint[],
    public readonly teams: TeamInfo[]
  ) {}

  private static mapTeamOwners = (gameData: GameResult, teams: TeamInfo[]) => {
    gameData.spawnPoints.forEach((spawnPoint, index) => {
      teams[index].owner = spawnPoint.owner;
    });
  };

  private static parseCollectablePositions = (
    index: number,
    gameData: GameResult,
    previousState: ParsedGameState | null
  ): Collectable[] => {
    let collectables: Collectable[] = [];

    // Set current collectables to previous collectables:
    if (index > 0 && previousState) {
      collectables = previousState.collectables.slice(0);
    }

    // Add new collectables:
    gameData.phaseResults[index].addedCollectables.forEach(
      (addedCollectable) => {
        collectables.push(addedCollectable);
      }
    );

    // Remove collected collectables:
    gameData.phaseResults[index].removedCollectables.forEach(
      (removedCollectableId) => {
        const index = collectables.findIndex(
          (c) => c.id === removedCollectableId
        );

        if (index !== -1) {
          collectables.splice(index, 1);
        }
      }
    );

    return collectables;
  };

  private static parseDisqualificationReasons = (
    phaseResult: PhaseResult,
    teams: TeamInfo[] = []
  ) => {
    phaseResult.disqualifiedBots.forEach((disqualifiedBot: DisqualifiedBot) => {
      if (disqualifiedBot?.id) {
        const team = teams.find((team) => team?.owner === disqualifiedBot?.id);

        if (team) {
          team.disqualificationReason = disqualifiedBot.reason;
        }
      }
    });
  };

  private static parsePlayerPositions = (
    index: number,
    gameData: GameResult,
    previousState: ParsedGameState | null,
    teams: TeamInfo[] = []
  ): Player[] => {
    const players: Player[] = [];
    let previousPlayers: number[] = [];

    if (index > 0 && previousState) {
      previousPlayers = previousState.players.map(
        (previousPlayer) => previousPlayer.id
      );
    }

    gameData.phaseResults[index].playerPositions.forEach((player) => {
      let teamIndex = -1;
      let owner: number | null = null;

      if (index === 0 || previousPlayers.indexOf(player.id) === -1) {
        // Add owner and teamIndex for players that have just spawned:
        const addedPlayerIndex = gameData.phaseResults[index].addedPlayers
          .map((addedPlayer) => addedPlayer.id)
          .indexOf(player.id);

        owner =
          gameData.phaseResults[index].addedPlayers[addedPlayerIndex].owner ||
          null;

        if (owner != null) {
          teamIndex = gameData.spawnPoints.findIndex(
            (spawnPoint) => spawnPoint.owner === owner
          );
        }
      } else if (previousState) {
        // Add owner and teamIndex for players that haven't just spawned:
        const previousIndex = previousState.players
          .map((previousPlayer) => previousPlayer.id)
          .indexOf(player.id);

        owner = previousState.players[previousIndex].owner;
        teamIndex = previousState.players[previousIndex].teamIndex;
      }

      teams[teamIndex].playerCount++;

      players.push({
        id: player.id,
        owner: owner ?? -1,
        cell: new Cell(player.position.x, player.position.y),
        teamIndex: teamIndex,
      });
    });

    return players;
  };

  private static parseSpawnPoints = (
    index: number,
    gameData: GameResult,
    previousState: ParsedGameState | null,
    teams: TeamInfo[] = []
  ): SpawnPoint[] => {
    let spawnPoints: SpawnPoint[] = [];

    // Set the current spawn points to the previous spawn point
    if (index === 0) {
      gameData.spawnPoints.forEach((spawnPoint) => {
        const teamIndex = teams.findIndex((x) => x.owner === spawnPoint.owner);

        spawnPoints.push({
          id: spawnPoint.id,
          owner: spawnPoint.owner,
          position: spawnPoint.position,
          teamIndex: teamIndex,
        });

        teams[teamIndex].spawnCount++;
      });
    } else {
      const destroyedSpawns: number[] = [];

      spawnPoints = previousState?.spawnPoints?.slice(0) ?? [];

      spawnPoints.forEach((spawnPoint) => {
        // Set the team spawn count:
        teams[spawnPoint.teamIndex].spawnCount =
          previousState!.teams[spawnPoint.teamIndex].spawnCount;

        // Decrement the count if the spawnPoint is in the removedSpawns array:
        const isRemoved = gameData.phaseResults[index].removedSpawnPoints.some(
          (id) => id === spawnPoint.id
        );

        if (isRemoved) {
          teams[spawnPoint.teamIndex].spawnCount--;

          destroyedSpawns.push(spawnPoint.id);
        }
      });

      destroyedSpawns.forEach((destroyedSpawn) => {
        const destroyedSpawnIndex = spawnPoints
          .map((spawnPoint) => spawnPoint.id)
          .indexOf(destroyedSpawn);

        spawnPoints.splice(destroyedSpawnIndex, 1);
      });
    }

    return spawnPoints;
  };

  public static parseMany = (gameData: GameResult): ParsedGameState[] => {
    if (!gameData) {
      throw 'No gameData';
    }

    const states: ParsedGameState[] = [];

    let previousGameState: ParsedGameState | null = null;

    for (let i = 0; i < gameData.phaseResults.length; i++) {
      const teams: TeamInfo[] = gameData.game.teams.map(
        () => new TeamInfo(null, null, 0, 0)
      );

      this.mapTeamOwners(gameData, teams);

      this.parseDisqualificationReasons(gameData.phaseResults[i], teams);

      const players = this.parsePlayerPositions(
        i,
        gameData,
        previousGameState,
        teams
      );

      const collectables = this.parseCollectablePositions(
        i,
        gameData,
        previousGameState
      );

      const spawnPositions = this.parseSpawnPoints(
        i,
        gameData,
        previousGameState,
        teams
      );

      const parsedGameState = new ParsedGameState(
        collectables,
        players,
        spawnPositions,
        teams
      );

      states.push(parsedGameState);

      // And lastly...
      previousGameState = parsedGameState;
    }

    return states;
  };
}
