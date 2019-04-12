package com.scottlogic.hackathon.game

import spock.lang.*

import groovy.transform.CompileStatic

import java.util.stream.Collectors

abstract class AbstractRouteSpec extends Specification {

    @CompileStatic
    protected static final class RANDOM {
        public static final String UNROLL = '#featureName (seed: #random.seed)'
    }

    @Shared GameGeometry map = new AlmostInfiniteGeometry()
    @Shared Direction[] directions = Direction.values()

    abstract Route createARouteStartingAt(Position position, Random random)
    abstract Route createARouteOfNonZeroLength(Random random)
    abstract Route createARouteOfZeroLength(Random random)

    @Unroll(RANDOM.UNROLL)
    def "A route collides with its own start position"(Random random) {

        given: "a position, and a route starting at it"
        Position start = randomPosition(random)
        Route route = createARouteStartingAt(start, random)

        expect: "the route collides with the start"
        route.collides([start])

        where: "repeat 5 times"
        random << testRandom(5)
    }

    @Unroll(RANDOM.UNROLL)
    def "A route has the expected start position"(Random random) {

        given: "a position, and a route starting at it"
        Position start = randomPosition(random)
        Route route = createARouteStartingAt(start, random)

        expect: "the route's 'getStart()' method returns the start position"
        route.getStart() == start

        where: "repeat 5 times"
        random << testRandom(5)
    }

    @Unroll(RANDOM.UNROLL)
    def "The positions covered by stream, iterator, and spliterator are the same"(Random random) {

        given: "a route"
        Route route = createARouteStartingAt(randomPosition(random), random)

        when: "the Positions produced by its 'stream', 'iterator', and 'spliterator' methods are all collected into lists"
        List stream = route.stream().collect(Collectors.toList())
        List iterator = route.iterator().collect()
        List spliterator = []
        route.spliterator().forEachRemaining {
            spliterator.add(it)
        }

        then: "all lists are the same"
        stream == iterator
        stream == spliterator

        where: "repeat 5 times"
        random << testRandom(5)
    }

    @Unroll(RANDOM.UNROLL)
    def "The directions covered by stream, iterator, and spliterator are the same"(Random random) {

        given: "a route"
        Route route = createARouteStartingAt(randomPosition(random), random)

        when: "the Directions produced by its 'streamDirections', 'directionIterator', and 'directionSpliterator' methods are all collected into lists"
        List stream = route.streamDirections().collect(Collectors.toList())
        List iterator = route.directionIterator().collect()
        List spliterator = []
        route.directionSpliterator().forEachRemaining {
            spliterator.add(it)
        }

        then: "all lists are the same"
        stream == iterator
        stream == spliterator

        where: "repeat 5 times"
        random << testRandom(5)
    }

    @Unroll(RANDOM.UNROLL)
    def "Stepping along a route reduces the length by 1"(Random random) {

        given: "a route of non-zero length"
        Route route = createARouteOfNonZeroLength(random)
        int len = route.length

        when: "the route is stepped along"
        def step = route.step()

        then: "the length has been reduced by 1"
        step.present
        step.get().length == len-1

        where: "repeat 5 times"
        random << testRandom(5)
    }

    @Unroll(RANDOM.UNROLL)
    def "A zero-length route has no first direction or 'step'"(Random random) {

        given: "a zero-length route"
        Route route = createARouteOfZeroLength(random)

        expect: "the length to be 0"
        route.length == 0

        and: "it to have no first direction"
        !route.getFirstDirection().present

        and: "it to have no 'step'"
        !route.step().present

        where:
        random << testRandom(1)
    }

    protected final Position randomPosition(Random random) {
        new Position(random.nextInt(1000001) + 500000, random.nextInt(1000001) + 500000)
    }

    protected final Direction randomDirection(Random random) {
        directions[random.nextInt(directions.length)]
    }

    protected static Iterable<Random> testRandom(int num) {
        return (1..num).collect { new Random() }
    }

    @CompileStatic
    static class AlmostInfiniteGeometry implements GameGeometry {

        @Override
        int getWidth() {
            return Integer.MAX_VALUE
        }

        @Override
        int getHeight() {
            return Integer.MAX_VALUE
        }

        @Override
        Position getRelativePosition(Position from, Direction direction, int distance) {
            int x = from.x
            int y = from.y

            if(direction.isEastward()) {
                x += distance
            } else if(direction.isWestward()) {
                x -= distance
            }

            if(direction.isNorthward()) {
                y -= distance
            } else if(direction.isSouthward()) {
                y += distance
            }

            return new Position(x, y)
        }

        @Override
        int xDistance(Position a, Position b) {
            return Math.abs(a.x - b.x)
        }

        @Override
        int yDistance(Position a, Position b) {
            return Math.abs(a.y - b.y)
        }

        @Override
        Route route(Position start, List<Direction> route) {
            throw new AssertionError('A Route implementation should not call GameGeometry.route(...)')
        }

        @Override
        Route straightLineRoute(Position start, Direction direction, int length) {
            throw new AssertionError('A Route implementation should not call GameGeometry.straightLineRoute(...)')
        }

        @Override
        Position getPosition(int x, int y) {
            return new Position(x, y)
        }
    }

}