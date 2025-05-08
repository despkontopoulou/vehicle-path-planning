package com.despkontopoulou.vehiclepathplanning.service.strategy;

import com.despkontopoulou.vehiclepathplanning.model.Node;
import com.despkontopoulou.vehiclepathplanning.model.PathResult;
import com.despkontopoulou.vehiclepathplanning.service.graph.RoutingGraph;
import org.springframework.stereotype.Component;

import java.util.*;

import static java.lang.System.nanoTime;

@Component("dijkstra")
public class DijkstraAlgorithm implements AlgorithmStrategy{
    private final RoutingGraph graph;

    public DijkstraAlgorithm(RoutingGraph graph) {
        this.graph = graph;
    }

    @Override
    public PathResult findPath(Node start, Node goal) {
        long startTime = nanoTime();

        // gScore holds the best-known distance from start → each node
        Map<Long, Double> gScore = new HashMap<>();
        // cameFrom holds the parent pointers for path reconstruction
        Map<Long, Long> cameFrom = new HashMap<>();

        // Min-heap ordered by gScore only
        PriorityQueue<Node> openSet =
                new PriorityQueue<>(Comparator.comparingDouble(n ->
                        gScore.getOrDefault(n.id(), Double.POSITIVE_INFINITY)));

        // Initialize
        gScore.put(start.id(), 0.0);
        openSet.add(start);

        boolean foundGoal = false;
        while (!openSet.isEmpty()) {
            Node current = openSet.poll();
            double currentDist = gScore.getOrDefault(current.id(), Double.POSITIVE_INFINITY);

            // Early exit if we reached the goal
            if (current.id().equals(goal.id())) {
                foundGoal = true;
                break;
            }

            // Relax each outgoing edge
            for (Map.Entry<Long, Double> e : graph.getNeighboursofNode(current.id()).entrySet()) {
                long nbrId = e.getKey();
                double weight = e.getValue();
                double tentative = currentDist + weight;

                if (tentative < gScore.getOrDefault(nbrId, Double.POSITIVE_INFINITY)) {
                    cameFrom.put(nbrId, current.id());
                    gScore.put(nbrId, tentative);
                    openSet.add(graph.getNode(nbrId));
                }
            }
        }

        // Build result
        List<Node> path = foundGoal
                ? reconstructPath(cameFrom, goal, graph)
                : Collections.emptyList();

        double totalCost = foundGoal
                ? gScore.get(goal.id())
                : Double.POSITIVE_INFINITY;

        long duration = nanoTime() - startTime;
        return new PathResult(path, totalCost, duration);
    }
}
