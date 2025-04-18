package com.despkontopoulou.vehiclepathplanning.model;

import java.util.HashMap;
import java.util.Map;

public class Graph {
    private final Map<Long, Map<Long, Double>> graph = new HashMap<>(); // graph data in the form of {node:{neighbour:weight}}
    private final Map<Long, Coordinate> coordinates = new HashMap<>();//the coordinates of each node in the graph

    public void addNode(Long nodeId, Coordinate coordinate) {//add a node to the graph
        coordinates.put(nodeId, coordinate);//store coordinate
        graph.putIfAbsent(nodeId, new HashMap<>());//put in graph and create empty list of neighbours
    }

    public void addEdge(Long fromNodeId, Long toNodeId, Double weight) {//add directed edges
        if(!graph.containsKey(fromNodeId)) {
            throw new IllegalArgumentException("fromNodeId "+ fromNodeId+" is not found");
        }
        graph.get(fromNodeId).put(toNodeId, weight);//assuming nodes are already added, add node and weight to neighbours
    }

    public Map<Long, Double> getNeighbours(Long nodeId) {//return neighbours of a node
        return graph.getOrDefault(nodeId, new HashMap<>());//if a neighbour isnt found, return empty map
    }
    public Coordinate getCoordinate(Long nodeId) {//return stored coordinates of a node
        return coordinates.getOrDefault(nodeId, new Coordinate(0,0));//if node isnt found return 0,0
    }
}
