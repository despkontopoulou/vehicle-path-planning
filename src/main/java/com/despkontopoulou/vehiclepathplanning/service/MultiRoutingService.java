package com.despkontopoulou.vehiclepathplanning.service;

import com.despkontopoulou.vehiclepathplanning.model.dto.request.MultiRouteRequest;
import com.despkontopoulou.vehiclepathplanning.model.dto.response.RouteResponse;
import com.despkontopoulou.vehiclepathplanning.utils.RoutingExecutor;
import org.springframework.stereotype.Service;

@Service
public class MultiRoutingService {

    private final RoutingExecutor executor;

    public MultiRoutingService(RoutingExecutor executor) {
        this.executor = executor;
    }

    public RouteResponse getMultiRoute(MultiRouteRequest request) {
        return executor.execute(request)
                .orElseThrow(() -> new RuntimeException("No route found"));
    }
}
