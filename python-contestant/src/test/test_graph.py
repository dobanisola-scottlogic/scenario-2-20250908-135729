import unittest

from game.direction import Direction
from game.map import Map
from game.position import Position
from game.route import find_route, Route


def generate_positions(positions):
    if isinstance(positions, tuple):
        return Position(positions[0], positions[1])
    elif isinstance(positions, list):
        return [Position(position[0], position[1]) for position in positions]


class Graph(unittest.TestCase):

    def setUp(self) -> None:
        self.map = Map(10, 10)

    def test_find_route_already_at_destination(self):
        expected_route = Route(generate_positions((0, 0)), generate_positions((0, 0)), self.map, [])
        actual_route = find_route(map=self.map, position_from=generate_positions((0, 0)),
                                  position_to=generate_positions((0, 0)),
                                  avoid_predicate=lambda pos: False)
        self.assertEqual(expected_route, actual_route)

    def test_find_route_no_route_available(self):
        obstacles = generate_positions([(0, 0), (1, 0), (0, 1), (0, 2), (1, 2), (2, 2), (2, 1), (2, 0)])
        self.assertIsNone(find_route(map=self.map, position_from=generate_positions((1, 1)),
                                     position_to=generate_positions((5, 0)),
                                     avoid_predicate=lambda pos: pos in obstacles))

    def test_find_route_one_path_expected(self):
        obstacles = generate_positions([(1, y) for y in range(2, 10)] + [(2, 2), (2, 5), (2, 9)] +
                                       [(3, 2), (3, 3), (3, 5), (3, 7)] + [(4, 3), (4, 7), (4, 8)] +
                                       [(5, y) for y in range(3, 8)] + [(6, 7), (6, 9), (7, 7)])
        expected_route = Route(generate_positions((2, 3)), generate_positions((7, 6)), self.map,
                               [Direction.SOUTHEAST, Direction.SOUTHEAST, Direction.SOUTHWEST, Direction.SOUTHWEST,
                                Direction.SOUTHEAST, Direction.SOUTHEAST, Direction.NORTHEAST, Direction.EAST,
                                Direction.EAST, Direction.NORTHEAST, Direction.NORTHWEST])
        actual_route = find_route(map=self.map, position_from=generate_positions((2, 3)),
                                  position_to=generate_positions((7, 6)),
                                  avoid_predicate=lambda pos: pos in obstacles)
        self.assertEqual(expected_route, actual_route)

    def test_find_route_two_paths_available(self):
        acceptable_routes = [Route(generate_positions((5, 2)), generate_positions((7, 2)), self.map,
                                   [Direction.SOUTHEAST, Direction.NORTHEAST]),
                             Route(generate_positions((5, 2)), generate_positions((7, 2)), self.map,
                                   [Direction.NORTHEAST, Direction.SOUTHEAST])]
        actual_route = find_route(map=self.map, position_from=generate_positions((5, 2)),
                                  position_to=generate_positions((7, 2)),
                                  avoid_predicate=lambda pos: pos == Position(6, 2))
        self.assertIn(actual_route, acceptable_routes)
