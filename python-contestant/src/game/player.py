from dataclasses import dataclass, field

from game.position import Position


@dataclass(frozen=True)
class Player:
    """
    A player (minion) in the game.

    Attributes:
        id (int): The unique ID of the current player.
        owner (int): The unique ID of the owner of the current player.
        position (Position): The position of the current player.
    """
    id: int
    owner: int
    position: Position = field(compare=False)
