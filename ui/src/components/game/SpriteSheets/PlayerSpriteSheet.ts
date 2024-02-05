import { Cell } from '~/interfaces/Cell';

import { SpriteSheetAnimationDefinition } from './SpriteSheetAnimationDefinition';
import { SpriteSheetDefinition } from './SpriteSheetDefinition';

export class PlayerSpriteSheet extends SpriteSheetDefinition {
  public readonly activeAnimation: SpriteSheetAnimationDefinition =
    new SpriteSheetAnimationDefinition(this.activeAnimationKey, 0, 7, 10, -1);
  public readonly dieAnimation: SpriteSheetAnimationDefinition =
    new SpriteSheetAnimationDefinition(this.removeAnimationKey, 8, 11, 20, 1);

  constructor() {
    super();

    this.animations.push(this.activeAnimation, this.dieAnimation);
  }

  public readonly displayHeight: number = Cell.CellHeight * 3;
  public readonly displayWidth: number = Cell.CellWidth * 3;
  public readonly identifier: string = 'sheet_player';
  public readonly repeatsEvery: number = 12;
  public readonly spriteHeight: number = 48;
  public readonly spriteWidth: number = 48;
  public readonly tileCount: number = 72;
}
