package com.despkontopoulou.vehiclepathplanning.service;

import com.despkontopoulou.vehiclepathplanning.model.dto.request.RouteRequest;
import com.despkontopoulou.vehiclepathplanning.model.dto.response.CompareRouteResponse;
import com.despkontopoulou.vehiclepathplanning.model.dto.response.RouteResponse;
import com.despkontopoulou.vehiclepathplanning.utils.GraphHopperMapper;
import com.graphhopper.GHRequest;
import com.graphhopper.GHResponse;
import com.graphhopper.GraphHopper;
import com.graphhopper.ResponsePath;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class CompareRoutingService {

    private final GraphHopper hopper;

    public CompareRoutingService(GraphHopper hopper) {
        this.hopper = hopper;
    }

    public CompareRouteResponse compareRoutes(RouteRequest request) {
        List<String> algorithms = List.of("dijkstra", "dijkstrabi", "astar", "astarbi");

        Map<String, RouteResponse> results = new HashMap<>();

        for (String algorithm : algorithms) {
            GHRequest ghRequest = new GHRequest(
                    request.startLat(),
                    request.startLon(),
                    request.endLat(),
                    request.endLon()
            ).setProfile(request.profile()!= null ? request.profile() : "car_fastest")
                    .setAlgorithm(algorithm);

            long startNs = System.nanoTime();
            GHResponse ghResponse = hopper.route(ghRequest);
            long endNs = System.nanoTime();

            long computationTimeNs = endNs - startNs;

            if (!ghResponse.hasErrors()) {
                ResponsePath path = ghResponse.getBest();
                results.put(algorithm, GraphHopperMapper.toRouteResponse(path, computationTimeNs));
            } else {
                // Optional: log or put null if route failed
                results.put(algorithm, null);
            }
        }

        return new CompareRouteResponse(results);
    }
}
