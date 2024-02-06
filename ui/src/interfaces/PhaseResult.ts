import { Collectable } from './Collectable';
import { DisqualifiedBot } from './DisqualifiedBot';
import { Player } from './Player';
import { PlayerPosition } from './PlayerPosition';

export interface PhaseResult {
  addedCollectables: Collectable[];
  addedPlayers: Player[];
  disqualifiedBots: DisqualifiedBot[];
  id: string;
  phase: number;
  playerPositions: PlayerPosition[];
  removedCollectables: number[];
  removedPlayers: number[];
  removedSpawnPoints: number[];
}
