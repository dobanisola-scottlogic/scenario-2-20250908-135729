import { CutoffCondition } from '~/enums/CutoffCondition';

import { Game } from './Game';
import { PhaseResult } from './PhaseResult';
import { SpawnPointData } from './SpawnPointData';

export interface GameResult {
  cutoffCondition: CutoffCondition;
  game: Game;
  id: string;
  phaseResults: PhaseResult[];
  spawnPoints: SpawnPointData[];
}
