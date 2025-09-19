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
import java.util.Map;

@Service
public class CompareRoutingService {

    private final GraphHopper hopper;

    public CompareRoutingService(GraphHopper hopper) {
        this.hopper = hopper;
    }

    public CompareRouteResponse compareRoutes(RouteRequest request) {
        Map<String, RouteResponse> results = new HashMap<>();

        for (String profile : new String[]{"car_fastest", "car_shortest", "car_eco"}) {
            GHRequest ghRequest = new GHRequest(
                    request.startLat(),
                    request.startLon(),
                    request.endLat(),
                    request.endLon()
            ).setProfile(profile)
                    .setAlgorithm("astar");

            GHResponse ghResponse = hopper.route(ghRequest);

            if (!ghResponse.hasErrors()) {
                ResponsePath path = ghResponse.getBest();
                results.put(profile, GraphHopperMapper.toRouteResponse(path));
            } else {
                // Optional: log or put null if route failed
                results.put(profile, null);
            }
        }

        return new CompareRouteResponse(results);
    }
}
