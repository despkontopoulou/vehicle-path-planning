package com.despkontopoulou.vehiclepathplanning.utils;

import com.despkontopoulou.vehiclepathplanning.model.dto.request.RouteRequest;
import com.despkontopoulou.vehiclepathplanning.model.dto.response.RouteResponse;
import com.graphhopper.GHRequest;
import com.graphhopper.GHResponse;
import com.graphhopper.GraphHopper;
import com.graphhopper.ResponsePath;
import org.springframework.stereotype.Component;

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
}