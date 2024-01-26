import { Cell } from '~/interfaces/Cell';

import { SpriteSheetDefinition } from './SpriteSheetDefinition';

export class PlayerSpriteSheet extends SpriteSheetDefinition {
  constructor() {
    super();
  }

  public readonly displayHeight: number = Cell.CellHeight;
  public readonly displayWidth: number = Cell.CellWidth;
  public readonly identifier: string = 'sheet_player';
  public readonly repeatsEvery: number = 12;
  public readonly spriteHeight: number = 48;
  public readonly spriteWidth: number = 48;
  public readonly tileCount: number = 72;
}
