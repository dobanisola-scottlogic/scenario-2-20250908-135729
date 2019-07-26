from __future__ import annotations

from dataclasses import dataclass, field
from itertools import islice
from typing import List, Iterator, Optional, Callable

from game.direction import Direction
from game.graph import RouteFinder
from game.map import Map
from game.position import Position


@dataclass(frozen=True)
class Route:
    """Represents a route that can be taken through a map.

    Attributes:
        start_position (Position): The starting position of the route.
        destination (Position): The ending position of the route.
    """
    start_position: Position
    destination: Position
    map: Map
    directions: List[Direction]
    index: int = 0

    def __iter__(self) -> PositionIterator:
        return PositionIterator(self.get_direction_iterator(), self.map, self.start_position)

    def __len__(self) -> int:
        """
        Returns:
            int: The number of steps required to traverse the route.
        """
        return len(self.directions) - self.index

    def get_direction_iterator(self) -> Iterator[Direction]:
        """
        Returns:
            Iterator: An iterator over the directional steps in this route.
        """
        return islice(self.directions, self.index, None)

    def get_first_direction(self) -> Optional[Direction]:
        """Gets the direction that the route moves away from the :attr:`starting position<start_position>`.
        If this route has zero length (i.e. is *just* the starting position), then ``None`` will be returned.

        Returns:
            :class:`Direction<game.direction.Direction>` or ``None``: The first direction to move in.
        """
        return self.directions[self.index] if self.index < len(self.directions) else None

    def step(self) -> Optional[Route]:
        """Gets the sub-route starting from the second position along this route.
        In other words, this imagines that one step has been taken along this route and returns the portion of the
        route still to travel.
        If this route has zero length (i.e. is *just* the starting position), then ``None`` will be returned.

        Returns:
            :class:`Route` or ``None``: The sub-route starting from the second position.
        """
        first_direction = self.get_first_direction()
        if first_direction is not None:
            return Route(map=self.map,
                         start_position=self.map.get_neighbour(self.start_position, first_direction),
                         destination=self.destination, directions=self.directions, index=self.index + 1)
        return None

    def collides(self, positions_check: Callable[[Position], bool]) -> bool:
        """Determines whether this route collides with (traverses) any position that is satisfied by the given
        predicate.

        Example::

            # Returns True if this route passes through the (0, 0) position
            route.collides(lambda position: position == Position(0, 0))

        Args:
            positions_check (Callable[[Position], bool]): The predicate to check against the positions of this object.
                It must be a function that receives a Position as an argument and returns a bool value.

        Returns:
            ``bool``: ``True`` If any positions along this route satisfies the predicate, ``False`` otherwise.
        """
        return any(positions_check(position) for position in self)

    def collides_with_positions(self, positions: List[Position]) -> bool:
        """Determines whether this route collides with (traverses) any of the specified positions.

        Args:
            positions (List[Position]): The positions to check whether this route collides with

        Returns:
            ``bool``: ``True`` if any positions along this route collides with the provided positions, ``False``
            otherwise.
        """
        return self.collides(lambda position: position in positions)

    def collides_with_route(self, other_route: Route) -> bool:
        """Determines whether this route and the given route collide.
        Two routes are said to collide *only* if they traverse the same position at the same 'time'.
        Formally, two routes, ``A`` and ``B`` are said to *collide* if there is a position ``x``
        and an integer ``k`` such that the ``k``\ th position along both ``A`` and ``B`` is ``x``.

        Args:
            other_route (Route): The other route to check for collision with.

        Returns:
            ``bool``: ``True`` if this route *collides* with the other, as defined above.
        """
        for my_position, other_position in zip(self, other_route):
            if my_position == other_position:
                return True
        return False


@dataclass
class PositionIterator:
    """Helper iterator class that generates Positions based on applying an iteration of Directions on an initial
    Position."""
    directions_iter: Iterator[Direction]
    game_map: Map
    current_position: Position
    first_iteration: bool = field(init=False, default=True)

    def __iter__(self) -> Iterator[Position]:
        return self

    def __next__(self) -> Position:
        if self.first_iteration:
            self.first_iteration = False
            return self.current_position
        next_direction = next(self.directions_iter, None)
        if next_direction is not None:
            self.current_position = self.game_map.get_neighbour(self.current_position, next_direction)
            return self.current_position
        else:
            raise StopIteration


def find_route(map: Map, position_from: Position, position_to: Position,
               avoid_predicate: Callable[[Position], bool]) -> Optional[Route]:
    """Finds (one of) the shortest route between the `position_from` and `position_to` Position arguments on the
    provided map, avoiding any positions that match the given predicate.

    This method uses the `A* search algorithm <https://en.wikipedia.org/wiki/A*_search_algorithm>`_.

    It is possible that no route will be found, if the set of positions that must be avoided forms an unbroken barrier
    between the start and target positions. In this situation, `None` will be returned.

    Args:
        map (Map): The Map on which to find a route.
        position_from (Position): The position to find a route from.
        position_to (Position): The position to find the route to.
        avoid_predicate (Callable[[Position], bool]): A predicate specifying which positions to avoid. It must be a
            function which receives a Position as an argument and returns a boolean result. The found route is
            guaranteed not to include any positions for which this returns ``True``.

    Returns:
        Route or ``None``: A Route containing an ordered list of directions and positions to move in to traverse the
        found route, otherwise ``None`` if no route could be found.
    """
    route_finder = RouteFinder(map=map, predicate=avoid_predicate)
    astar_result = route_finder.astar(position_from, position_to)
    if astar_result is not None:
        directions = [result[1] for result in astar_result if isinstance(result, tuple)]
        return Route(start_position=position_from, destination=position_to, map=map, directions=directions)
    else:
        return None
