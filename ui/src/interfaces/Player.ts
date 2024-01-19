import { Cell } from './Cell';

export interface Player {
  cell: Cell;
  id: number;
  owner: number;
  teamIndex: number;
}
