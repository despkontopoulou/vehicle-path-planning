package com.despkontopoulou.vehiclepathplanning.service.strategy;

import com.despkontopoulou.vehiclepathplanning.model.Coordinate;
import com.despkontopoulou.vehiclepathplanning.model.Node;
import com.despkontopoulou.vehiclepathplanning.model.PathResult;
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
    public PathResult findPath(Node start, Node goal) { //main method-find path from start to end
        long startTime = System.nanoTime(); //start time record in the beginning of search
        Map<Long, Double> gScore = new HashMap<>();//map to store the cost from start to each node
        Map<Long, Long> cameFrom = new HashMap<>();// map of predecessors
        PriorityQueue<Node> openSet = new PriorityQueue<>(Comparator.comparingDouble(n -> fScore(n, gScore, goal)));//priority queue of nodes to explore
        gScore.put(start.id(), 0.0);//start cost from start obviously 0
        openSet.add(start);

        while (!openSet.isEmpty()) {//keep exploring until no more paths or goal found
            Node current = openSet.poll();//pick node from set, it has the lowest f score

            if (current.id().equals(goal.id())) {//if we reach goal return path
                break;
            }

            for (Map.Entry<Long, Double> neighbourEntry : graph.getNeighboursofNode(current.id()).entrySet()) { //if not, loop through neighbours
                Long neighbourId = neighbourEntry.getKey();//get id and edge weight from neighbour node
                Double weight = neighbourEntry.getValue();

                double tentativeGScore = gScore.get(current.id()) + weight; // tentative cost through current
                if (tentativeGScore < gScore.getOrDefault(neighbourId, Double.POSITIVE_INFINITY)) {//if tentative is shorter
                    cameFrom.put(neighbourId, current.id());//update path
                    gScore.put(neighbourId, tentativeGScore);//update cost
                    Node neighbourNode = graph.getNode(neighbourId);//add neighbour to explore
                    openSet.add(neighbourNode);
                }
            }
        }

        List<Node> path = reconstructPath(cameFrom, goal, graph);
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
