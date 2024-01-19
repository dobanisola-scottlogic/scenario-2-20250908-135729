import { Position } from './Position';

export interface SpawnPoint {
  id: number;
  owner: number;
  position: Position;
  teamIndex: number;
}
