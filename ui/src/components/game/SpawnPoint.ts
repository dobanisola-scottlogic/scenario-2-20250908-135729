import { Position } from '~/interfaces/Position';

export class SpawnPoint {
  constructor(
    public readonly id: number,
    public readonly owner: number,
    public readonly position: Position,
    public readonly teamIndex: number
  ) {}
}
