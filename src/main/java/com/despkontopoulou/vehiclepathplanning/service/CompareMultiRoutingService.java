package com.despkontopoulou.vehiclepathplanning.service;

import com.despkontopoulou.vehiclepathplanning.model.dto.request.MultiRouteRequest;
import com.despkontopoulou.vehiclepathplanning.model.dto.response.CompareRouteResponse;
import com.despkontopoulou.vehiclepathplanning.model.dto.response.RouteResponse;
import com.despkontopoulou.vehiclepathplanning.utils.RoutingExecutor;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class CompareMultiRoutingService {
    private final RoutingExecutor executor;

    public CompareMultiRoutingService(RoutingExecutor executor) {
        this.executor = executor;
    }

    public CompareRouteResponse compareMultiRoutes(MultiRouteRequest request) {
        List<String> algorithms = List.of("dijkstra", "dijkstrabi", "astar", "astarbi");

        Map<String, RouteResponse> results = new HashMap<>();

        for (String algorithm : algorithms) {
            MultiRouteRequest algoRequest = new MultiRouteRequest(
                    request.startLat(),
                    request.startLon(),
                    request.endLat(),
                    request.endLon(),
                    request.waypoints(),
                    request.profile(),
                    algorithm
            );

            executor.execute(algoRequest)
                    .ifPresentOrElse(
                            route -> results.put(algorithm, route),
                            () -> results.put(algorithm, null)
                    );
        }

        return new CompareRouteResponse(results);
    }
}
