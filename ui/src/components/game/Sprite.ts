import { Cell } from '~/interfaces/Cell';
import { Colour } from '~/utils/colours';

import { ParsedGameState } from './ParsedGameState';

export class Sprite {
  constructor(
    public readonly game: ParsedGameState,
    public readonly id: string,
    public readonly width: number,
    public readonly height: number,
    public readonly cell: Cell,
    public readonly colour: Colour
  ) {}
}
