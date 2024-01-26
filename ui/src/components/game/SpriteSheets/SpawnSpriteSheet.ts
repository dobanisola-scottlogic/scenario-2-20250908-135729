import { Cell } from '~/interfaces/Cell';

import { SpriteSheetDefinition } from './SpriteSheetDefinition';

export class SpawnSpriteSheet extends SpriteSheetDefinition {
  public static readonly IndexOfActive: number = 0;
  public static readonly IndexOfDefault: number = 0;
  public static readonly IndexOfDie: number = 11;

  constructor() {
    super();
  }

  public readonly displayHeight: number = Cell.CellHeight * 3;
  public readonly displayWidth: number = Cell.CellWidth * 3;
  public readonly identifier: string = 'sheet_spawn';
  public readonly repeatsEvery: number = 18;
  public readonly spriteHeight: number = 64;
  public readonly spriteWidth: number = 64;
  public readonly tileCount: number = 108;
}
