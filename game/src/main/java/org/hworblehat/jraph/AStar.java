package org.hworblehat.jraph;

import java.util.*;
import java.util.function.ToIntFunction;

/**
 * Minimal A* pathfinding implementation.
 * This is a simplified implementation to replace the missing jraph library.
 */
public class AStar {
    
    /**
     * Find a route using A* algorithm.
     */
    public static <V, E> Optional<Route<E>> findIntRoute(
            V start, 
            V goal, 
            DirectedGraph<V, E, Integer> graph, 
            ToIntFunction<V> heuristic) {
        
        Map<V, Integer> gScore = new HashMap<>();
        Map<V, Integer> fScore = new HashMap<>();
        Map<V, E> cameFrom = new HashMap<>();
        Map<V, V> parentMap = new HashMap<>();
        Set<V> openSet = new HashSet<>();
        Set<V> closedSet = new HashSet<>();
        
        gScore.put(start, 0);
        fScore.put(start, heuristic.applyAsInt(start));
        openSet.add(start);
        
        while (!openSet.isEmpty()) {
            V current = openSet.stream()
                .min(Comparator.comparing(v -> fScore.getOrDefault(v, Integer.MAX_VALUE)))
                .orElse(null);
                
            if (current == null) break;
            
            if (current.equals(goal)) {
                return Optional.of(reconstructPath(cameFrom, parentMap, current, graph));
            }
            
            openSet.remove(current);
            closedSet.add(current);
            
            graph.getOutgoingEdges(current).forEach(edge -> {
                V neighbor = graph.getEndVertex(edge);
                
                if (closedSet.contains(neighbor)) {
                    return;
                }
                
                int tentativeGScore = gScore.getOrDefault(current, Integer.MAX_VALUE) + graph.getCost(edge);
                
                if (!openSet.contains(neighbor)) {
                    openSet.add(neighbor);
                } else if (tentativeGScore >= gScore.getOrDefault(neighbor, Integer.MAX_VALUE)) {
                    return;
                }
                
                cameFrom.put(neighbor, edge);
                parentMap.put(neighbor, current);
                gScore.put(neighbor, tentativeGScore);
                fScore.put(neighbor, tentativeGScore + heuristic.applyAsInt(neighbor));
            });
        }
        
        return Optional.empty();
    }
    
    private static <V, E> Route<E> reconstructPath(Map<V, E> cameFrom, Map<V, V> parentMap, V current, DirectedGraph<V, E, Integer> graph) {
        List<E> path = new ArrayList<>();
        V node = current;
        
        while (cameFrom.containsKey(node)) {
            E edge = cameFrom.get(node);
            path.add(0, edge);
            node = parentMap.get(node);
        }
        
        return new Route<>(path);
    }
    
    /**
     * Simple route container.
     */
    public static class Route<E> {
        private final List<E> edges;
        
        public Route(List<E> edges) {
            this.edges = new ArrayList<>(edges);
        }
        
        public List<E> getEdges() {
            return Collections.unmodifiableList(edges);
        }
    }
}