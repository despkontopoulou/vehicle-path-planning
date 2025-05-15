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

    public PathResult findRoute(double startLat, double startLon , double goalLat , double goalLon, RoutePreference pref, AlgorithmType algorithmType) {
        Coordinate startCoordinate = new Coordinate(startLat,startLon);
        Coordinate goalCoordinate = new Coordinate(goalLat,goalLon);
        Node startNode = graph.getClosestNode(startCoordinate);
        Node goalNode = graph.getClosestNode(goalCoordinate);
        AlgorithmStrategy strategy = switch (algorithmType){
          case ASTAR ->  astarAlgorithm;
          case DIJKSTRA ->  dijkstraAlgorithm;
        };
        return strategy.findPath(startNode, goalNode, pref);
    }

    public Map<String, PathResult> compareRoutes(
            double startLat, double startLon , double goalLat , double goalLon,
            RoutePreference pref){
        Coordinate startCoordinate = new Coordinate(startLat,startLon);
        Coordinate goalCoordinate = new Coordinate(goalLat,goalLon);
        Node startNode = graph.getClosestNode(startCoordinate);
        Node goalNode = graph.getClosestNode(goalCoordinate);

        PathResult astarResult = astarAlgorithm.findPath(startNode, goalNode, pref);
        PathResult dijkstraResult = dijkstraAlgorithm.findPath(startNode, goalNode, pref);

        return Map.of(
                "astar", astarResult,
                "dijkstra", dijkstraResult
        );
    }

    public PathResult bestRoute(
            double startLat, double startLon , double goalLat , double goalLon,
            RoutePreference pref) {
        Coordinate startCoordinate = new Coordinate(startLat,startLon);
        Coordinate goalCoordinate = new Coordinate(goalLat,goalLon);
        Node startNode = graph.getClosestNode(startCoordinate);
        Node goalNode = graph.getClosestNode(goalCoordinate);

        //for now just astar
        return astarAlgorithm.findPath(startNode, goalNode, pref);
    }

}
