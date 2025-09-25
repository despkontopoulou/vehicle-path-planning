package com.despkontopoulou.vehiclepathplanning.service;

import com.despkontopoulou.vehiclepathplanning.model.dto.request.RouteRequest;
import com.despkontopoulou.vehiclepathplanning.model.dto.response.CompareRouteResponse;
import com.despkontopoulou.vehiclepathplanning.model.dto.response.RouteResponse;
import com.despkontopoulou.vehiclepathplanning.utils.RoutingExecutor;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class CompareRoutingService {

    private final RoutingExecutor executor;

    public CompareRoutingService(RoutingExecutor executor) {
        this.executor = executor;
    }

    public CompareRouteResponse compareRoutes(RouteRequest request) {
        List<String> algorithms = List.of("dijkstra", "dijkstrabi", "astar", "astarbi");

        Map<String, RouteResponse> results = new HashMap<>();

        for (String algorithm : algorithms) {
            executor.execute(request, algorithm)
                    .ifPresentOrElse(
                            route -> results.put(algorithm, route),
                            () -> results.put(algorithm, null)
                    );
        }

        return new CompareRouteResponse(results);
    }
}
