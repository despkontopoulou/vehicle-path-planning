package com.despkontopoulou.vehiclepathplanning.service;

import com.despkontopoulou.vehiclepathplanning.model.dto.request.RouteRequest;
import com.despkontopoulou.vehiclepathplanning.model.dto.response.RouteResponse;
import com.despkontopoulou.vehiclepathplanning.utils.GraphHopperMapper;
import com.graphhopper.GHRequest;
import com.graphhopper.GHResponse;
import com.graphhopper.GraphHopper;
import com.graphhopper.ResponsePath;
import org.springframework.stereotype.Service;

@Service
public class RoutingService {

    private final GraphHopper hopper;

    public RoutingService(GraphHopper hopper) {
        this.hopper = hopper;
    }

    public RouteResponse getRoute(RouteRequest request) {
        GHRequest ghRequest = new GHRequest(
                request.startLat(),
                request.startLon(),
                request.endLat(),
                request.endLon())
            .setProfile(request.profile())
            .setAlgorithm("astar");

        GHResponse ghResponse = hopper.route(ghRequest);

        if (ghResponse.hasErrors()) {
            throw new RuntimeException("Routing failed: " +ghResponse.getErrors());// TODO: fix error handling
        }

        ResponsePath path = ghResponse.getBest();
        return GraphHopperMapper.toRouteResponse(path);
    }


}
