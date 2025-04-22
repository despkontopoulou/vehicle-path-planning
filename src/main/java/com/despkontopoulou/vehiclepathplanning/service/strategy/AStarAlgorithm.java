package com.despkontopoulou.vehiclepathplanning.service.strategy;

import com.despkontopoulou.vehiclepathplanning.model.Coordinate;
import com.despkontopoulou.vehiclepathplanning.model.Node;
import com.despkontopoulou.vehiclepathplanning.service.graph.RoutingGraph;
import com.graphhopper.routing.RoutingAlgorithm;

import java.util.*;

public class AStarAlgorithm implements AlgorithmStrategy{ //implement strategy interface
    private final RoutingGraph graph; //store ref to graph

    public AStarAlgorithm(RoutingGraph graph) {
        this.graph = graph; //dependency injection
    }
    @Override
    public List<Node> findPath(Node start, Node goal) { //main method-find path from start to end
        Map<Long, Double> gScore = new HashMap<>();//map to store the cost from start to each node
        Map<Long, Long> cameFrom = new HashMap<>();// map of predecessors
        PriorityQueue<Node> openSet = new PriorityQueue<>(Comparator.comparingDouble(n -> fScore(n, gScore, goal)));//priority queue of nodes to explore
        gScore.put(start.id(), 0.0);//start cost from start obviously 0
        openSet.add(start);

        while (!openSet.isEmpty()) {//keep exploring until no more paths or goal found
            Node current = openSet.poll();//pick node from set, it has the lowest f score

            if (current.id().equals(goal.id())) {//if we reach goal return path
                return reconstructPath(cameFrom, goal);
            }

            for (Map.Entry<Long, Double> neighborEntry : graph.getNeighboursofNode(current.id()).entrySet()) { //if not, loop through neighbours
                Long neighborId = neighborEntry.getKey();//get id and edge weight!!!!!!!!!!!! CHECK
                Double weight = neighborEntry.getValue();

                double tentativeGScore = gScore.get(current.id()) + weight; // tentative cost through current
                if (tentativeGScore < gScore.getOrDefault(neighborId, Double.POSITIVE_INFINITY)) {//if tentative is shorter
                    cameFrom.put(neighborId, current.id());//update path
                    gScore.put(neighborId, tentativeGScore);//update cost
                    Node neighborNode = graph.getNode(neighborId);//add neighbour to explore
                    openSet.add(neighborNode);
                }
            }
        }

        return Collections.emptyList(); //no path found
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

    private List<Node> reconstructPath(Map<Long, Long> cameFrom, Node goal) {//rebuild path from goal to start by following predecessors
        List<Node> path = new ArrayList<>();
        for (Long at = goal.id(); at != null; at = cameFrom.get(at)) {
            path.add(graph.getNode(at));
        }
        Collections.reverse(path);
        return path;
    }
}
