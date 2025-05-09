package com.despkontopoulou.vehiclepathplanning.service.strategy;

import com.despkontopoulou.vehiclepathplanning.model.EdgeData;
import com.despkontopoulou.vehiclepathplanning.model.Node;
import com.despkontopoulou.vehiclepathplanning.model.PathResult;
import com.despkontopoulou.vehiclepathplanning.model.RoutePreference;
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
    public PathResult findPath(Node start, Node goal, RoutePreference pref) {
        long startTime = nanoTime();

        Map<Long, Double> gScore = new HashMap<>(); //distances from start to each node
        Map<Long, Long> cameFrom = new HashMap<>(); //predecessors

        PriorityQueue<Node> openSet =//minheap ordered by g score
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
            for (Map.Entry<Long, EdgeData> edge : graph.getEdges(current.id()).entrySet()) {
                long neighbourId = edge.getKey();
                EdgeData edgeData = edge.getValue();
                double weight=  computeWeight(edgeData,pref);//based on the users pref get weighting
                double tentative = currentDist + weight;

                if (tentative < gScore.getOrDefault(neighbourId, Double.POSITIVE_INFINITY)) {
                    cameFrom.put(neighbourId, current.id());
                    gScore.put(neighbourId, tentative);
                    openSet.add(graph.getNode(neighbourId));
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
