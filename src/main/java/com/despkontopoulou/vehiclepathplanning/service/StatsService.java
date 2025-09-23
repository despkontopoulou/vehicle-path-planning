package com.despkontopoulou.vehiclepathplanning.service;

import com.despkontopoulou.vehiclepathplanning.model.dto.StatsEntry;
import com.despkontopoulou.vehiclepathplanning.model.dto.request.RouteRequest;
import com.despkontopoulou.vehiclepathplanning.model.dto.request.StatsRequest;
import com.despkontopoulou.vehiclepathplanning.model.dto.response.StatsResponse;
import com.despkontopoulou.vehiclepathplanning.utils.RoutingExecutor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class StatsService {

    private final RoutingExecutor executor;

    public StatsService(RoutingExecutor executor) {
        this.executor = executor;
    }

    public StatsResponse runStats(StatsRequest request) {
        List<StatsEntry> results = new ArrayList<>();

        for (String vehicle : request.vehicles()) {
            for (String profile : request.profiles()) {
                String combinedProfile = vehicle + "_" + profile;

                for (String algorithm : request.algorithms()) {
                    RouteRequest routeRequest = new RouteRequest(
                            request.startLat(),
                            request.startLon(),
                            request.endLat(),
                            request.endLon(),
                            combinedProfile,
                            algorithm
                    );

                    executor.execute(routeRequest, algorithm).ifPresent(route ->
                            results.add(new StatsEntry(
                                    vehicle,
                                    profile,
                                    algorithm,
                                    route.totalDistance(),
                                    route.totalTime(),
                                    route.computationTimeNs() / 1_000_000,
                                    route.exploredNodes()
                            ))
                    );
                }
            }
        }
        return new StatsResponse(results);
    }
}
