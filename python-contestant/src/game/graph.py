from dataclasses import dataclass
from typing import Callable

from astar import AStar

from game.direction import get_shuffled_directions
from game.map import Map
from game.position import Position


@dataclass(frozen=True)
class RouteFinder(AStar):
    map: Map
    predicate: Callable[[Position], bool]

    def heuristic_cost_estimate(self, current, goal):
        return self.map.distance_between(current, goal) if isinstance(current, Position) else self.map.distance_between(
            current[0], goal)

    def distance_between(self, n1, n2):
        return 1

    def neighbors(self, node):
        node_position = node if isinstance(node, Position) else node[0]
        return [neighbour for neighbour in
                ((self.map.get_neighbour(node_position, direction), direction) for direction in
                 get_shuffled_directions()) if (isinstance(neighbour, Position) and not self.predicate(neighbour)) or (
                        isinstance(neighbour, tuple) and not self.predicate(neighbour[0]))]

    def is_goal_reached(self, current, goal):
        return current == goal if isinstance(current, Position) else current[0] == goal
