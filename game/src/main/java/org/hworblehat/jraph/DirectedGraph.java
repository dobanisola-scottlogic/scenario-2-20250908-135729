package org.hworblehat.jraph;

import java.util.stream.Stream;

/**
 * Minimal interface for directed graphs used by the A* pathfinding algorithm.
 */
public interface DirectedGraph<V, E, C> {
    
    /**
     * Get all outgoing edges from a vertex.
     */
    Stream<E> getOutgoingEdges(V vertex);
    
    /**
     * Get the start vertex of an edge.
     */
    V getStartVertex(E edge);
    
    /**
     * Get the end vertex of an edge.
     */
    V getEndVertex(E edge);
    
    /**
     * Get the cost of traversing an edge.
     */
    C getCost(E edge);
}