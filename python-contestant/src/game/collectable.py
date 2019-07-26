from dataclasses import dataclass, field

from game.position import Position


@dataclass(frozen=True)
class Collectable:
    """A collectable item in the game.

    Attributes:
        id (int): The unique id of the current collectable item.
        position (Position): The position of the current collectable item.
        type (str): The type of the current collectable item.
    """
    id: int
    position: Position = field(compare=False)
    type: str
