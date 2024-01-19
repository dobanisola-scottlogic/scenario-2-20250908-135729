import { Cell } from '~/interfaces/Cell';
import { Colour } from '~/utils/colours';

import { ParsedGameState } from './ParsedGameState';

export class Spawn {
  constructor(
    public readonly game: ParsedGameState,
    public readonly id: string,
    public readonly colour: Colour,
    public readonly owner: number,
    cell: Cell
  ) {
    this.cell = cell.clone();
  }

  public cell: Cell;
}
