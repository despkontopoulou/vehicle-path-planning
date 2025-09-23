package com.despkontopoulou.vehiclepathplanning.service;

import com.despkontopoulou.vehiclepathplanning.model.dto.request.MultiRouteRequest;
import com.despkontopoulou.vehiclepathplanning.model.dto.response.RouteResponse;
import com.despkontopoulou.vehiclepathplanning.utils.RoutingExecutor;
import com.graphhopper.GHRequest;
import com.graphhopper.GraphHopper;
import com.graphhopper.util.shapes.GHPoint;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class MultiRoutingService {

    private final RoutingExecutor executor;

    public MultiRoutingService(RoutingExecutor executor) {
        this.executor = executor;
    }

    public RouteResponse getMultiRoute(MultiRouteRequest request) {
        return executor.execute(request)
                .orElseThrow(() -> new RuntimeException("No route found")); //TODO: HANDLE EXCEPTIONS
    }
}
