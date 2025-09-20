package com.despkontopoulou.vehiclepathplanning.service;

import com.despkontopoulou.vehiclepathplanning.model.dto.request.RouteRequest;
import com.despkontopoulou.vehiclepathplanning.model.dto.response.RouteResponse;
import com.despkontopoulou.vehiclepathplanning.utils.RoutingExecutor;
import com.graphhopper.GraphHopper;
import org.springframework.stereotype.Service;

@Service
public class RoutingService {

    private final RoutingExecutor executor;

    public RoutingService(RoutingExecutor executor) {
        this.executor = executor;
    }

    public RouteResponse getRoute(RouteRequest request) {
        // Always use astar for now
        return executor.execute(request, "astar")
                .orElseThrow(() -> new RuntimeException("Routing failed"));
    }

}
