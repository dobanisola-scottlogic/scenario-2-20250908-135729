import { Cell } from '~/interfaces/Cell';

import { SpriteSheetAnimationDefinition } from './SpriteSheetAnimationDefinition';

export abstract class SpriteSheetDefinition {
  public readonly animations: SpriteSheetAnimationDefinition[] = [];
  public readonly idKey: string = 'id';
  public readonly activeAnimationKey: string = 'active';
  public readonly removeAnimationKey: string = 'remove';

  public abstract readonly displayHeight: number;
  public abstract readonly displayWidth: number;
  public abstract readonly identifier: string;
  public abstract readonly spriteHeight: number;
  public abstract readonly spriteWidth: number;
  public abstract readonly repeatsEvery: number;
  public abstract readonly tileCount: number;

  get hasRemoveAnimation(): boolean {
    return this.animations?.some((x) => x.key === this.removeAnimationKey);
  }

  get scaleX(): number {
    return Cell.CellWidth / this.spriteHeight;
  }

  get scaleY(): number {
    return Cell.CellWidth / this.spriteWidth;
  }

  get url(): string {
    return `/application/assets/${this.identifier}.png`;
  }
}
