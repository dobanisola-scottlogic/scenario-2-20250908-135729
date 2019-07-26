import unittest

from game.direction import Direction
from game.map import Map
from game.position import Position
from game.route import Route


class TestRoute(unittest.TestCase):

    def setUp(self) -> None:
        # 0,0 -> 0,1 -> 0,2 -> 1,3 -> 2,3
        self.route = Route(start_position=Position(0, 0), destination=Position(2, 3), map=Map(100, 100),
                           directions=[Direction.SOUTH, Direction.SOUTH, Direction.SOUTHEAST, Direction.EAST])

    def test_positions_iter(self):
        positions_iter = iter(self.route)
        self.assertEqual(Position(0, 0), next(positions_iter, None))
        self.assertEqual(Position(0, 1), next(positions_iter, None))
        self.assertEqual(Position(0, 2), next(positions_iter, None))
        self.assertEqual(Position(1, 3), next(positions_iter, None))
        self.assertEqual(Position(2, 3), next(positions_iter, None))
        self.assertIsNone(next(positions_iter, None))

    def test_len(self):
        self.assertEqual(4, len(self.route))
        new_route = self.route.step()
        self.assertEqual(3, len(new_route))
        new_route = new_route.step()
        self.assertEqual(2, len(new_route))
        new_route = new_route.step()
        self.assertEqual(1, len(new_route))
        new_route = new_route.step()
        self.assertEqual(0, len(new_route))

    def test_directions_iter(self):
        directions_iter = self.route.get_direction_iterator()
        for direction_iter, direction in zip(directions_iter, self.route.directions):
            self.assertEqual(direction_iter, direction)
        new_route = self.route.step()
        directions_iter = new_route.get_direction_iterator()
        for direction_iter, direction in zip(directions_iter, [Direction.SOUTH, Direction.SOUTHEAST, Direction.EAST]):
            self.assertEqual(direction_iter, direction)

    def test_get_first_direction(self):
        self.assertEqual(Direction.SOUTH, self.route.get_first_direction())
        new_route = self.route.step()
        self.assertEqual(Direction.SOUTH, new_route.get_first_direction())
        new_route = new_route.step()
        self.assertEqual(Direction.SOUTHEAST, new_route.get_first_direction())
        new_route = new_route.step()
        self.assertEqual(Direction.EAST, new_route.get_first_direction())
        self.assertIsNone(new_route.step().get_first_direction())

    def test_step(self):
        new_route = self.route.step()
        self.assertEqual(Route(start_position=Position(0, 1), destination=self.route.destination, map=self.route.map,
                               directions=self.route.directions, index=1), new_route)
        new_route = new_route.step()
        self.assertEqual(Route(start_position=Position(0, 2), destination=self.route.destination, map=self.route.map,
                               directions=self.route.directions, index=2), new_route)
        new_route = new_route.step()
        self.assertEqual(Route(start_position=Position(1, 3), destination=self.route.destination, map=self.route.map,
                               directions=self.route.directions, index=3), new_route)
        new_route = new_route.step()
        self.assertEqual(Route(start_position=Position(2, 3), destination=self.route.destination, map=self.route.map,
                               directions=self.route.directions, index=4), new_route)
        self.assertIsNone(new_route.step())

    def test_collides_predicate(self):
        self.assertTrue(self.route.collides(lambda pos: pos == Position(2, 3)))
        self.assertFalse(self.route.collides(lambda pos: pos == Position(2, 2)))

    def test_collides_with_obstacles_starting_position(self):
        obstacles = [Position(0, 0)]
        self.assertTrue(self.route.collides_with_positions(obstacles))

    def test_collides_with_obstacles_when_no_collisions(self):
        obstacles = [Position(0, 3), Position(4, 4), Position(3, 3)]
        self.assertFalse(self.route.collides_with_positions(obstacles))

    def test_collides_with_obstacles_when_same_route(self):
        obstacles = [Position(1, 3), Position(4, 4), Position(3, 3)]
        self.assertTrue(self.route.collides_with_positions(obstacles))

    def test_collides_with_obstacles_when_no_obstacles(self):
        obstacles = []
        self.assertFalse(self.route.collides_with_positions(obstacles))

    def test_collides_with_same_route(self):
        route = Route(start_position=Position(0, 0), destination=Position(2, 3), map=self.route.map,
                      directions=[Direction.SOUTH, Direction.SOUTH, Direction.SOUTHEAST, Direction.EAST])
        self.assertTrue(self.route.collides_with_route(route))

    def test_collides_with_colliding_route(self):
        # 1,1 -> 2,1 -> 2,2 -> 1,3 (COLLISION) -> 1,4
        route = Route(start_position=Position(1, 1), destination=Position(1, 4), map=self.route.map,
                      directions=[Direction.EAST, Direction.SOUTH, Direction.SOUTHWEST, Direction.SOUTH])
        self.assertTrue(self.route.collides_with_route(route))

    def test_collides_with_route_same_position_at_different_time_point(self):
        # 1,1 -> 2,2 -> 1,3 -> 1,4
        route = Route(start_position=Position(1, 1), destination=Position(1, 4), map=self.route.map,
                      directions=[Direction.SOUTHEAST, Direction.SOUTH, Direction.SOUTHWEST, Direction.SOUTH])
        self.assertFalse(self.route.collides_with_route(route))


if __name__ == '__main__':
    unittest.main()
