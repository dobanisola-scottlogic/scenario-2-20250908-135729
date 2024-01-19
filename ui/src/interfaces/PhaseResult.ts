import { Collectable } from './Collectable';
import { DisqualifiedBot } from './DisqualifiedBot';
import { Player } from './Player';
import { PlayerPosition } from './PlayerPosition';
import { SpawnPoint } from './SpawnPoint';

export interface PhaseResult {
  addedCollectables: Collectable[];
  addedPlayers: Player[];
  disqualifiedBots: DisqualifiedBot[];
  id: string;
  phase: number;
  playerPositions: PlayerPosition[];
  removedCollectables: Collectable[];
  removedPlayers: number[];
  removedSpawnPoints: SpawnPoint[];
}
