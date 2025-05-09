package com.despkontopoulou.vehiclepathplanning.service.strategy;

import com.despkontopoulou.vehiclepathplanning.model.*;
import com.despkontopoulou.vehiclepathplanning.service.graph.RoutingGraph;
import com.graphhopper.routing.RoutingAlgorithm;
import org.springframework.stereotype.Component;

import java.util.*;

import static java.lang.System.nanoTime;

@Component("astar")
public class AStarAlgorithm implements AlgorithmStrategy{ //implement strategy interface
    private final RoutingGraph graph; //store ref to graph

    public AStarAlgorithm(RoutingGraph graph) {
        this.graph = graph; //dependency injection
    }

    @Override
    public PathResult findPath(Node start, Node goal, RoutePreference pref) { //main method-find path from start to end
        long startTime = System.nanoTime(); //start time record in the beginning of search
        Map<Long, Double> gScore = new HashMap<>();//map to store the cost from start to each node
        Map<Long, Long> cameFrom = new HashMap<>();// map of predecessors

        PriorityQueue<Node> openSet = new PriorityQueue<>(Comparator.comparingDouble(n -> fScore(n, gScore, goal)));//priority queue of nodes to explore

        gScore.put(start.id(), 0.0);//start cost from start obviously 0
        openSet.add(start);

        boolean found = false;
        while (!openSet.isEmpty()) {//keep exploring until no more paths or goal found
            Node current = openSet.poll();//pick node from set, it has the lowest f score

            if (current.id().equals(goal.id())) {//if we reach goal return path
                found = true;
                break;
            }

            for (Map.Entry<Long, EdgeData> edge : graph.getEdges(current.id()).entrySet()) { //if not, loop through neighbours
                Long neighbourId = edge.getKey();//get id and edge weight from neighbour node
                EdgeData raw  = edge.getValue();
                double weight = computeWeight(raw, pref);
                double tentative = gScore.get(current.id()) + weight;

                if (tentative < gScore.getOrDefault(neighbourId, Double.POSITIVE_INFINITY)) {
                    cameFrom.put(neighbourId, current.id());
                    gScore.put(neighbourId, tentative);
                    openSet.add(graph.getNode(neighbourId));
                }
            }
        }
        List<Node> path = found
                ? reconstructPath(cameFrom, goal, graph)
                : Collections.emptyList();

        double totalCost = path.isEmpty()
                ? Double.POSITIVE_INFINITY // if no path indicate no valid route with inf
                : gScore.get(goal.id());//otherwise the totalcost is the g of the end
        long duration = nanoTime() - startTime;
        return new PathResult(path, totalCost, duration);
    }
    private double fScore(Node node, Map<Long, Double> gScore, Node goal) {
        return gScore.getOrDefault(node.id(), Double.POSITIVE_INFINITY)
                + heuristic(node.coords(), goal.coords());
    }//combine h and g

    private double heuristic(Coordinate a, Coordinate b) {//EUCLIDEAN FOR NOW
        double dx = a.latitude() - b.latitude();
        double dy = a.longitude() - b.longitude();
        return Math.sqrt(dx * dx + dy * dy);
    }

}
