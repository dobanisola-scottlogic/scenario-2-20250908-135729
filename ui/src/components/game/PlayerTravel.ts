import { PlayerMovement } from '~/enums/PlayerMovement';
import { Position } from '~/interfaces/Position';

export class PlayerTravel {
  constructor(
    public readonly playerMovement: PlayerMovement,
    public readonly position: Position,
    public readonly hasWrappedAroundMap: boolean
  ) {}
}
