from dataclasses import dataclass

from game.direction import Direction


@dataclass(frozen=True)
class Move:
    """
    Represents a player's movement.

    Attributes:
        player (int): The ID of the player carrying out the movement.
        direction (Direction): The direction of the movement.
    """
    player: int
    direction: Direction
