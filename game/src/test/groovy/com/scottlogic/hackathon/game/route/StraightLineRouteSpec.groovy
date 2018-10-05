package com.scottlogic.hackathon.game.route

import com.scottlogic.hackathon.game.Direction
import com.scottlogic.hackathon.game.Position
import com.scottlogic.hackathon.game.Route
import spock.lang.Unroll

import java.util.function.Predicate

import static com.scottlogic.hackathon.game.Direction.*

class StraightLineRouteSpec extends AbstractRouteSpec {

    @Override
    Route createARouteStartingAt(Position position, Random random) {
        return new StraightLineRoute(map, position, randomDirection(random), random.nextInt(100))
    }

    @Override
    Route createARouteOfNonZeroLength(Random random) {
        return new StraightLineRoute(map, randomPosition(random), randomDirection(random),
                1 + random.nextInt(100))
    }

    @Override
    Route createARouteOfZeroLength(Random random) {
        return new StraightLineRoute(map, randomPosition(random), randomDirection(random), 0)
    }

    @Unroll
    def "A route iterates over the correct number of #direction directions (seed: #random.seed)"(
            Direction direction, Random random) {

        given: "a straight route of known length"
        int len = random.nextInt(100)
        Route route = new StraightLineRoute(map, randomPosition(random), direction, len)

        expect: "it to have the correct length"
        route.getLength() == len

        when: "its directions are iterated over"
        List<Direction> directions = route.directionIterator().collect()

        then: "there are the correct number"
        directions.size() == len

        then: "they are all correct"
        directions.inject(true) { init, d -> init && d == direction }

        where: "each direction is checked"
        direction << Direction.values()

        random = new Random()

    }

    def "A route collides with a known position on it"(Direction direction, int len, int x, int y) {

        given: "a route and a known position along it"
        def route = new StraightLineRoute(map, new Position(100, 100), direction, len)

        expect: "the route to collide with the known position"
        route.collides([new Position(x, y)])

        where:
        direction | len || x   | y
        NORTH     | 3   || 100 | 99
        WEST      | 5   || 95  | 100
        SOUTH     | 30  || 100 | 110
        NORTHEAST | 9   || 108 | 92
    }

    def "The route doesn't collide with positions known not to be on it"(Direction direction, int len,
            Predicate<Position> collide) {

        given: "a route"
        def route = new StraightLineRoute(map, new Position(100, 100), direction, len)

        expect: "the route not to collide positions known not to be on it"
        !route.collides(collide)

        where:
        direction | len || collide
        NORTH     | 30  || { it.x != 100 }
        WEST      | 12  || { it.x < 88 }
        NORTHEAST | 5   || { it.x < 100 || it.x > 105 || it.y < 95 || it.y > 100 }
        SOUTHEAST | 50  || { it.x != it.y }
    }

}
