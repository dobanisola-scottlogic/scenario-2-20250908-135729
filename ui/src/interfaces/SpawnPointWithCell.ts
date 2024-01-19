import { Cell } from './Cell';

export interface SpawnPointWithCell {
  cell: Cell;
  id: number;
  owner: number;
  teamIndex: number;
}
