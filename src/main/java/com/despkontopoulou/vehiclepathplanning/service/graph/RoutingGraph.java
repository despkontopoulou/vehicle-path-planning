package com.despkontopoulou.vehiclepathplanning.service.graph;

import com.despkontopoulou.vehiclepathplanning.model.Coordinate;
import com.despkontopoulou.vehiclepathplanning.model.Node;

import java.util.List;
import java.util.Map;

public interface RoutingGraph {
    Coordinate getCoordinatesOfNode(int nodeId);
    List<Node> getNeighboursofNode(int nodeId);
    List<Node> reconstructPath(List<Node> predecessors,Node start, Node goal);
}
