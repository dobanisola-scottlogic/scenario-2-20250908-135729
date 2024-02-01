export enum PlayerMovement {
  STATIONARY = 0,
  NORTH = 1,
  NORTHEAST = 2,
  EAST = 3,
  SOUTHEAST = 4,
  SOUTH = 5,
  SOUTHWEST = 6,
  WEST = 7,
  NORTHWEST = 8,
}

export default class PlayerMovementUtils {
  static calculatePlayerMovement(
    movementX: number,
    movementY: number
  ): PlayerMovement {
    if (movementX === 1) {
      if (movementY === -1) {
        return PlayerMovement.NORTHEAST;
      }

      if (movementY === 0) {
        return PlayerMovement.EAST;
      }

      if (movementY === 1) {
        return PlayerMovement.SOUTHEAST;
      }
    }

    if (movementX === 0) {
      if (movementY === -1) {
        return PlayerMovement.NORTH;
      }

      if (movementY === 0) {
        return PlayerMovement.STATIONARY;
      }

      if (movementY === 1) {
        return PlayerMovement.SOUTH;
      }
    }

    if (movementX === -1) {
      if (movementY === -1) {
        return PlayerMovement.NORTHWEST;
      }

      if (movementY === 0) {
        return PlayerMovement.WEST;
      }

      if (movementY === 1) {
        return PlayerMovement.SOUTHWEST;
      }
    }

    return PlayerMovement.STATIONARY;
  }

  // While Phaser defines the angle as Right (East) = 0, Down (South) = 90,
  // Our player sprites are drawn on the Sprite Map pointing South West,
  // so we need to adjust our angles by -135 degrees to account for this:
  public static getAngle = (playerMovement: PlayerMovement) => {
    switch (playerMovement) {
      case PlayerMovement.NORTH:
        return 135;

      case PlayerMovement.NORTHEAST:
        return 180;

      case PlayerMovement.EAST:
        return 225;

      case PlayerMovement.SOUTHEAST:
        return 270;

      case PlayerMovement.SOUTH:
        return 315;

      case PlayerMovement.SOUTHWEST:
        return 0;

      case PlayerMovement.WEST:
        return 45;

      case PlayerMovement.NORTHWEST:
        return 90;
    }

    return 0;
  };
}
