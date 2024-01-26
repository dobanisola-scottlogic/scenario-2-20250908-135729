import { Cell } from '~/interfaces/Cell';

import { SpriteSheetDefinition } from './SpriteSheetDefinition';

export class MapSpriteSheet extends SpriteSheetDefinition {
  public static readonly IndexOfClear: number = 0;
  public static readonly IndexOfObstruction: number = 1;

  constructor() {
    super();
  }

  public readonly displayHeight: number = Cell.CellHeight;
  public readonly displayWidth: number = Cell.CellWidth;
  public readonly identifier: string = 'sheet_map';
  public readonly repeatsEvery: number = 0;
  public readonly spriteHeight: number = 20;
  public readonly spriteWidth: number = 20;
  public readonly tileCount: number = 2;
}
