export class SpriteSheetAnimationDefinition {
  constructor(
    public readonly key: string,
    public readonly start: number,
    public readonly end: number,
    public readonly frameRate: number,
    public readonly repeat: number
  ) {}
}
