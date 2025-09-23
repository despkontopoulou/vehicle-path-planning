package com.despkontopoulou.vehiclepathplanning.utils;

import com.despkontopoulou.vehiclepathplanning.model.dto.request.MultiRouteRequest;
import com.despkontopoulou.vehiclepathplanning.model.dto.request.RouteRequest;
import com.despkontopoulou.vehiclepathplanning.model.dto.response.RouteResponse;
import com.graphhopper.GHRequest;
import com.graphhopper.GHResponse;
import com.graphhopper.GraphHopper;
import com.graphhopper.ResponsePath;
import com.graphhopper.util.shapes.GHPoint;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Component
public class RoutingExecutor {

    private final GraphHopper hopper;

    public RoutingExecutor(GraphHopper hopper) {
        this.hopper = hopper;
    }

    public Optional<RouteResponse> execute(RouteRequest request, String algorithm) {
        GHRequest ghRequest = new GHRequest(
                request.startLat(),
                request.startLon(),
                request.endLat(),
                request.endLon()
        ).setProfile(request.profile() != null ? request.profile() : "car_fastest")
                .setAlgorithm(algorithm);

        long startNs = System.nanoTime();
        GHResponse ghResponse = hopper.route(ghRequest);
        long computationTimeNs = System.nanoTime() - startNs;

        if (ghResponse.hasErrors()) {
            return Optional.empty();
        }

        ResponsePath path = ghResponse.getBest();

        long exploredNodes = 0;
        if (ghResponse.getHints().has("visited_nodes.sum")) {
            exploredNodes = ghResponse.getHints().getLong("visited_nodes.sum", 0);
        }

        return Optional.of(GraphHopperMapper.toRouteResponse(path, computationTimeNs, exploredNodes));
    }

    public Optional<RouteResponse> execute(MultiRouteRequest request) {
        List<GHPoint> points = new ArrayList<>();
        points.add(new GHPoint(request.startLat(), request.startLon()));
        if (request.waypoints() != null) {
            for (double[] waypoint : request.waypoints()) {
                points.add(new GHPoint(waypoint[0], waypoint[1]));
            }
        }
        points.add(new GHPoint(request.endLat(), request.endLon()));

        GHRequest ghRequest = new GHRequest(points)
                .setProfile(request.profile() != null ? request.profile() : "car_fastest")
                .setAlgorithm(request.algorithm() != null ? request.algorithm() : "astar");
        long startNs = System.nanoTime();
        GHResponse ghResponse = hopper.route(ghRequest);
        long computationTimeNs = System.nanoTime() - startNs;

        if (ghResponse.hasErrors()) {
            throw new RuntimeException("Routing failed: "+ ghResponse.getErrors());
        }

        ResponsePath path = ghResponse.getBest();

        long exploredNodes = 0;
        if (ghResponse.getHints().has("visited_nodes.sum")) {
            exploredNodes = ghResponse.getHints().getLong("visited_nodes.sum", 0);
        }

        return Optional.of(GraphHopperMapper.toRouteResponse(path, computationTimeNs, exploredNodes));
    }
}