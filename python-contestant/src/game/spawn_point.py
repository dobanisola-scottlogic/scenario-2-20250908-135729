from dataclasses import dataclass

from game.position import Position


@dataclass(frozen=True)
class SpawnPoint:
    """A spawn point in the game.

    Attributes:
        id (int): The unique ID of the current spawn point.
        position (Position): The position of the current spawn point.
        owner (int): The unique ID of the owner of the current spawn point.
    """
    id: int
    position: Position
    owner: int
