package com.scottlogic.hackathon.game

import spock.lang.*

import java.util.function.Predicate

import static com.scottlogic.hackathon.game.Direction.*

class ListRouteSpec extends AbstractRouteSpec {

    @Override
    RouteImpl createARouteStartingAt(Position position, Random random) {
        List<Direction> directionList = randomDirectionList(0, random)
        Position dest = position
        for (Direction dir : directionList){
            dest = map.getNeighbour(dest, dir)
        }
        return new RouteImpl(map, position, dest, directionList)
    }

    @Override
    Route createARouteOfNonZeroLength(Random random) {
        Position randomPos = randomPosition(random)
        List<Direction> directionList = randomDirectionList(1, random)
        Position dest = randomPos
        for (Direction dir : directionList){
            dest = map.getNeighbour(dest, dir)
        }
        return new RouteImpl(map,randomPos, dest,  directionList)
    }

    @Override
    Route createARouteOfZeroLength(Random random) {
        return new RouteImpl(map, randomPosition(random), randomPosition(random),  [])
    }

    private List<Direction> randomDirectionList(int minLength, Random random) {
        (minLength..random.nextInt(100)).collect { randomDirection(random) }
    }

    @Unroll(RANDOM.UNROLL)
    def "The route iterates over its list of directions"(Random random) {

        given: "a list of directions, and a route using it"
        def dirs = randomDirectionList(0, random)
        def route = new RouteImpl(map, randomPosition(random), null, dirs)

        expect: "the route to iterate over the list of directions"
        route.directionIterator().collect() == dirs

        where: "repeat 5 times"
        random << testRandom(5)
    }

    def "The route collides with a known position on it"(List directions, int x, int y) {

        given: "a route and a known position along it"
        def route = new RouteImpl(map, new Position(100,100), null, directions)

        expect: "the route to collide with the known position"
        route.collides([new Position(x,y)])

        where:
        directions                    | x   | y
        [NORTH]                       | 100 | 99
        [SOUTH, WEST, NORTH, NORTH]   | 99  | 100
        [EAST, EAST, SOUTH, EAST]     | 101 | 100
        [EAST, EAST, EAST, NORTHWEST] | 102 | 99
    }

    def "The route doesn't collide with positions known not to be on it"(List directions, Predicate<Position> collide) {

        given: "a route"
        def route = new RouteImpl(map, new Position(100,100), null, directions)

        expect: "the route not to collide positions known not to be on it"
        !route.collides(collide)

        where:
        directions                    | collide
        [NORTH]                       | { it.x != 100 }
        [SOUTH, WEST, NORTH, NORTH]   | { it.x > 100 && it.y > 101}
        [EAST, EAST, SOUTH, EAST]     | { (it.x < 100 || it.x > 103) && (it.y < 100 || it.y > 101) }
        [EAST, EAST, EAST, NORTHWEST] | { it.x == 104 }
    }

}
