from dataclasses import dataclass


@dataclass(frozen=True)
class Position:
    """A position in (x, y) coordinate space - (0, 0) being top-left.
    
    Does not perform any checking of whether the given coordinates are within the bounds of a particular
    :class:`Map<game.map.Map>`, and will throw an exception if either coordinate is negative. Consider using
    :meth:`Map.get_position(int, int)<game.map.Map.get_position>` instead of this constructor for a safer way of
    creating positions.

    Attributes:
        x (int): The (horizontal) x-coordinate of the position
        y (int): The (vertical) y-coordinate of the position

    Raises:
          ValueError: If either x or y are less than 0
    """
    x: int
    y: int

    def __post_init__(self):
        if self.x < 0:
            raise ValueError('x must be >= 0')
        if self.y < 0:
            raise ValueError('y must be >= 0')
