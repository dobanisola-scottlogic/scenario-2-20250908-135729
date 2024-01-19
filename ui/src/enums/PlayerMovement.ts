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
}
