package com.despkontopoulou.vehiclepathplanning.service;

import com.despkontopoulou.vehiclepathplanning.model.*;
import com.despkontopoulou.vehiclepathplanning.service.graph.RoutingGraph;
import com.despkontopoulou.vehiclepathplanning.service.strategy.AStarAlgorithm;
import com.despkontopoulou.vehiclepathplanning.service.strategy.AlgorithmStrategy;
import com.despkontopoulou.vehiclepathplanning.service.strategy.DijkstraAlgorithm;
import com.graphhopper.GraphHopper;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;

import java.util.Map;

import static com.despkontopoulou.vehiclepathplanning.model.AlgorithmType.*;

@Service
public class PathfindingService {
    private final RoutingGraph graph;
    private final AlgorithmStrategy astarAlgorithm;
    private final AlgorithmStrategy dijkstraAlgorithm;


    public PathfindingService(
            RoutingGraph graph,
            @Qualifier("astar") AlgorithmStrategy astarAlgorithm,
            @Qualifier("dijkstra") AlgorithmStrategy dijkstraAlgorithm) {
        this.graph = graph;
        this.astarAlgorithm = astarAlgorithm;
        this.dijkstraAlgorithm = dijkstraAlgorithm;
    }

    public PathResult findRoute(Coordinate startCoordinate, Coordinate goalCoordinate, RoutePreference pref, AlgorithmType algorithmType) {
        Node startNode = graph.getClosestNode(startCoordinate);
        Node goalNode = graph.getClosestNode(goalCoordinate);
        AlgorithmStrategy strategy = switch (algorithmType){
          case ASTAR ->  astarAlgorithm;
          case DIJKSTRA ->  dijkstraAlgorithm;
        };
        return strategy.findPath(startNode, goalNode, pref);
    }

    public Map<String, PathResult> compareRoutes(
            Coordinate startCoordinate,
            Coordinate goalCoordinate,
            RoutePreference pref){
        Node startNode = graph.getClosestNode(startCoordinate);
        Node goalNode = graph.getClosestNode(goalCoordinate);

        PathResult astarResult = astarAlgorithm.findPath(startNode, goalNode, pref);
        PathResult dijkstraResult = dijkstraAlgorithm.findPath(startNode, goalNode, pref);

        return Map.of(
                "astar", astarResult,
                "dijkstra", dijkstraResult
        );
    }

}
