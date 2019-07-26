from dataclasses import dataclass
from typing import Iterator

from game.direction import Direction
from game.position import Position


@dataclass(frozen=True)
class Map:
    """A definition of an area in which games take place, and its geographic logic - for instance, whether it loops at
    the edges.

    This includes information and methods relating to the map's overall size and shape, but not the locations of
    :attr:`obstacles<game.state.GameState.out_of_bounds_positions>`,
    :attr:`collectables<game.state.GameState.collectables>`, :attr:`players<game.state.GameState.players>`,
    or :attr:`spawn points<game.state.GameState.spawn_points>`. Information about these elements must be obtained from
    the :class:`game state<game.state.GameState>`, and, unlike this class, will be limited by what your players can see.

    Attributes:
        width (int): The width of the map
        height (int): The height of the map
    """
    width: int
    height: int

    def get_position(self, x: int, y: int) -> Position:
        """
        Creates a new :class:`Position` whose coordinates are *equivalent* to those given.

        Depending on the geometry of the map, the coordinates of the resulting Position object may not be identical
        to those given. For example, if the map's x-coordinates "wrap around" (like longitude on a map of the Earth),
        and an x-coordinate greater than the maximum is specified, it will be converted to the equivalent value less
        than the maximum.

        Args:
            x (int): The (horizontal) x-coordinate of the position to create
            y (int): The (vertical) y-coordinate of the position to create

        Returns:
            Position: A position with equivalent coordinates
        """
        return Position(x % self.width, y % self.height)

    def get_relative_position(self, position_from: Position, direction: Direction, distance: int) -> Position:
        """
        Calculates the position on the current map that is displaced by the specified distance and direction from the
        given position.

        Args:
            position_from (Position): The position from which to calculate the relative position.
            direction (Direction): The direction of the position to calculate from the *position_from*.
            distance (int): The distance of the position to calculate from the *position_from*.

        Returns:
            Position: The calculated relative position.
        """
        x = position_from.x
        y = position_from.y
        if direction.is_eastward:
            x += distance
        elif direction.is_westward:
            x -= distance
        if direction.is_northward:
            y -= distance
        elif direction.is_southward:
            y += distance
        return self.get_position(x, y)

    def x_distance_between(self, a: Position, b: Position) -> int:
        """Determines the absolute horizontal distance between two positions.
        This is defined as smallest number of phases it would take for a player to move from one position to the other
        until it had the same x-coordinate as the other position, assuming there are no
        :attr:`obstacles<game.state.GameState.out_of_bounds_position>` in the way.

        Args:
            a (Position): One of the positions to find the distance between.
            b (Position): The other of the positions to find the distance between.

        Returns:
            int: The horizontal distance in number of phases.
        """
        return _directed_distance(a.x, b.x, self.width)

    def y_distance_between(self, a: Position, b: Position) -> int:
        """Determines the absolute vertical distance between two positions.
        This is defined as smallest number of phases it would take for a player to move from one position to the other
        until it had the same y-coordinate as the other position, assuming there are no
        :attr:`obstacles<game.state.GameState.out_of_bounds_position>` in the way.

        Args:
            a (Position): One of the positions to find the distance between.
            b (Position): The other of the positions to find the distance between.

        Returns:
            int: The vertical distance in number of phases.
        """
        return _directed_distance(a.y, b.y, self.height)

    def distance_between(self, a: Position, b: Position) -> int:
        """Determines the distance between two positions.
        This is defined as smallest number of phases it would take for a player to move from one position to the other,
        assuming there are no :attr:`obstacles<game.state.GameState.out_of_bounds_position>` in the way.

        Args:
            a (Position): One of the positions to find the distance between.
            b (Position): The other of the positions to find the distance between.

        Returns:
            int - The distance, in number of phases.
        """
        dx = self.x_distance_between(a, b)
        dy = self.y_distance_between(a, b)
        return dx if dx > dy else dy

    def get_neighbour(self, position_from: Position, direction: Direction) -> Position:
        """Determines the position that is next to the given position in the specified direction.

        Args:
            position_from (Position): The position to find the neighbour of.
            direction (Direction):  The direction of the neighbour to find from the *position_from*.

        Returns:
            Position: The calculated neighbour.
        """
        return self.get_relative_position(position_from, direction, 1)

    def directions_towards(self, position_from: Position, position_towards: Position) -> Iterator[Direction]:
        """
        Generates all :class:`Directions<game.direction.Direction>` from one position that are towards another.
        A direction is defined as *towards* the target position if moving a single step in that direction reduces
        the :meth:`distance<distance_between>` to the target position. It does not take account of any obstacles that
        may be in the way.

        Note that the returned iterator will often produce more than one direction,
        as several moves would result in a reduced distance to the target. It may also:

            * Be empty - if the target and start point are the same.
            * Contain all directions - if the map is square and the target is on the exact opposite side.

        Args:
            position_from (Position): The starting position to determine the direction to move from.
            position_towards (Position): The target position to reduce the distance to.

        Returns:
            Iterator[Direction]: An iterator generating all directions that are towards the target.
        """
        distance = self.distance_between(position_from, position_towards)
        return (direction for direction in Direction if
                self.distance_between(self.get_neighbour(position_from, direction),
                                      position_towards) < distance)

    def directions_away(self, position_from: Position, position_away_from: Position) -> Iterator[Direction]:
        """
        Generates all :class:`Directions<game.direction.Direction>` from one position that are away from another.
        A direction is defined as *away from* the target position if moving a single step in that direction increases
        the :meth:`distance<distance_between>` to the target position. It does not take account of any obstacles that
        may be in the way.

        Note that the returned iterator will often produce more than one direction,
        as several moves would result in a increased distance to the avoided position. It may also:

            * Be empty - if the target and start point are the same.
            * Contain all directions - if the map is square and the target is on the exact opposite side.

        Args:
            position_from (Position): The starting position to determine the direction to move from.
            position_away_from (Position): The position to move away from (increase the distance to).

        Returns:
            Iterator[Direction]: An iterator generating all directions that are away from the target.
        """
        distance = self.distance_between(position_from, position_away_from)
        return (direction for direction in Direction if
                self.distance_between(self.get_neighbour(position_from, direction),
                                      position_away_from) > distance)


def _directed_distance(a: int, b: int, extent: int):
    d = abs(b - a)
    return extent - d if d > extent / 2 else d
