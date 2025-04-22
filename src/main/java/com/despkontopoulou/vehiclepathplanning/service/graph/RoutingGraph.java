package com.despkontopoulou.vehiclepathplanning.service.graph;

import com.despkontopoulou.vehiclepathplanning.model.Coordinate;
import com.despkontopoulou.vehiclepathplanning.model.Node;

import java.util.List;
import java.util.Map;

public interface RoutingGraph {
    Coordinate getCoordinatesOfNode(Long nodeId);
    Map<Long,Double> getNeighboursofNode(Long nodeId);
    Node getNode(Long nodeId);
}
