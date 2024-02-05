import { SpriteSheetAnimationDefinition } from './SpriteSheetAnimationDefinition';
import { SpriteSheetDefinition } from './SpriteSheetDefinition';

export class CollectableSpriteSheet extends SpriteSheetDefinition {
  public readonly spinAnimation: SpriteSheetAnimationDefinition =
    new SpriteSheetAnimationDefinition(this.activeAnimationKey, 0, 7, 10, -1);
  public readonly collectedAnimation: SpriteSheetAnimationDefinition =
    new SpriteSheetAnimationDefinition(this.removeAnimationKey, 8, 14, 20, 1);

  constructor() {
    super();

    this.animations.push(this.spinAnimation, this.collectedAnimation);
  }

  public readonly displayHeight: number = 32;
  public readonly displayWidth: number = 32;
  public readonly identifier: string = 'sheet_collectable';
  public readonly repeatsEvery: number = 0;
  public readonly spriteHeight: number = 64;
  public readonly spriteWidth: number = 64;
  public readonly tileCount: number = 15;
}
