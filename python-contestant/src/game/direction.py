from __future__ import annotations

from enum import Enum
from random import randrange, shuffle
from typing import List


def get_random_direction() -> Direction:
    """
    Returns:
        Direction: A random direction.
    """
    directions = [d for d in Direction]
    return directions[randrange(len(directions))]


def get_shuffled_directions() -> List[Direction]:
    """
    Returns:
      List[Direction]: A list of all possible directions in random order.
    """
    directions = [d for d in Direction]
    shuffle(directions)
    return directions


class Direction(Enum):
    """Enumeration representing the directions a bot's player can move."""
    NORTH = "NORTH"
    NORTHEAST = "NORTHEAST"
    EAST = "EAST"
    SOUTHEAST = "SOUTHEAST"
    SOUTH = "SOUTH"
    SOUTHWEST = "SOUTHWEST"
    WEST = "WEST"
    NORTHWEST = "NORTHWEST"

    @property
    def is_eastward(self) -> bool:
        """
        Determines whether moving in this direction will result in being further East.

        Returns:
            ``bool``: ``True`` if moving in this direction will result in being further East, otherwise ``False``.
        """
        return self in [Direction.NORTHEAST, Direction.EAST, Direction.SOUTHEAST]

    @property
    def is_westward(self) -> bool:
        """
        Determines whether moving in this direction will result in being further West.

        Returns:
            ``bool``: ``True`` if moving in this direction will result in being further West, otherwise ``False``.
        """
        return self in [Direction.SOUTHWEST, Direction.WEST, Direction.NORTHWEST]

    @property
    def is_southward(self) -> bool:
        """
        Determines whether moving in this direction will result in being further South.

        Returns:
            ``bool``: ``True`` if moving in this direction will result in being further South, otherwise ``False``.
        """
        return self in [Direction.SOUTHEAST, Direction.SOUTH, Direction.SOUTHWEST]

    @property
    def is_northward(self) -> bool:
        """
        Determines whether moving in this direction will result in being further North.

        Returns:
            ``bool``: ``True`` if moving in this direction will result in being further North, otherwise ``False``.
        """
        return self in [Direction.NORTH, Direction.NORTHEAST, Direction.NORTHWEST]

    def get_opposite_direction(self) -> Direction:
        """Returns a direction value which is opposite to the current one.

        >>> Direction.NORTHEAST.get_opposite_direction()
        <Direction.SOUTHWEST: 'SOUTHWEST'>

        Returns:
            Direction: The opposite direction value to the current one.
        """
        directions = [d for d in Direction]
        opp = len(directions) // 2
        assert opp * 2 == len(directions)
        return directions[(directions.index(self) + opp) % len(directions)]
