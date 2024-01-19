import { CutoffCondition } from '~/enums/CutoffCondition';

import { Game } from './Game';
import { PhaseResult } from './PhaseResult';
import { SpawnPoint } from './SpawnPoint';

export interface GameResult {
  cutoffCondition: CutoffCondition;
  game: Game;
  id: string;
  phaseResults: PhaseResult[];
  spawnPoints: SpawnPoint[];
}
