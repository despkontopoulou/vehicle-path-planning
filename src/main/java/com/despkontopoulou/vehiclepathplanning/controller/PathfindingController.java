package com.despkontopoulou.vehiclepathplanning.controller;

import com.despkontopoulou.vehiclepathplanning.model.dto.request.MultiRouteRequest;
import com.despkontopoulou.vehiclepathplanning.model.dto.request.RouteRequest;
import com.despkontopoulou.vehiclepathplanning.model.dto.request.StatsRequest;
import com.despkontopoulou.vehiclepathplanning.model.dto.response.CompareRouteResponse;
import com.despkontopoulou.vehiclepathplanning.model.dto.response.RouteResponse;
import com.despkontopoulou.vehiclepathplanning.model.dto.response.StatsResponse;
import com.despkontopoulou.vehiclepathplanning.service.*;

import java.util.ArrayList;
import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/routes")
public class PathfindingController {

    private final StatsService statsService;
    private MultiRoutingService multiRoutingService;
    private RoutingService routingService;
    private CompareRoutingService compareRoutingService;
    private final CompareMultiRoutingService compareMultiRoutingService;

    public PathfindingController(RoutingService routingService,
                                 CompareRoutingService compareRoutingService,
                                 MultiRoutingService multiRoutingService,
                                 CompareMultiRoutingService compareMultiRoutingService,
                                 StatsService statsService) {
        this.routingService = routingService;
        this.compareRoutingService = compareRoutingService;
        this.multiRoutingService = multiRoutingService;
        this.compareMultiRoutingService = compareMultiRoutingService;
        this.statsService = statsService;
    }

    @GetMapping
    public RouteResponse getRoute(
            @RequestParam double startLat,
            @RequestParam double startLon,
            @RequestParam double endLat,
            @RequestParam double endLon,
            @RequestParam(defaultValue = "car_fastest") String profile,
            @RequestParam(defaultValue = "astar")  String algorithm
    ){
        RouteRequest request = new RouteRequest(startLat, startLon, endLat, endLon, profile, algorithm);
        return routingService.getRoute(request);
    }

    // GET /api/routes/compare
    @GetMapping("/compare")
    public CompareRouteResponse compareRoutes(
            @RequestParam double startLat,
            @RequestParam double startLon,
            @RequestParam double endLat,
            @RequestParam double endLon,
            @RequestParam(defaultValue = "car_fastest") String profile
    ) {
        RouteRequest request = new RouteRequest(startLat, startLon, endLat, endLon, profile, null);
        return compareRoutingService.compareRoutes(request);
    }

    @GetMapping("/multi")
    public RouteResponse getMultiRoute(
            @RequestParam double startLat,
            @RequestParam double startLon,
            @RequestParam double endLat,
            @RequestParam double endLon,
            @RequestParam(required = false) List<Double> viaLat,
            @RequestParam(required = false) List<Double> viaLon,
            @RequestParam(defaultValue = "car_fastest") String profile,
            @RequestParam(defaultValue = "astar") String algorithm
    ) {
        List<double[]> waypoints = new ArrayList<>();
        if (viaLat != null && viaLon != null && viaLat.size() == viaLon.size()) {
            for (int i = 0; i < viaLat.size(); i++) {
                waypoints.add(new double[]{viaLat.get(i), viaLon.get(i)});
            }
        }

        MultiRouteRequest request = new MultiRouteRequest(
                startLat, startLon, endLat, endLon, waypoints, profile, algorithm
        );

        return multiRoutingService.getMultiRoute(request);
    }

    @GetMapping("/multi/compare")
    public CompareRouteResponse compareMultiRoutes(
            @RequestParam double startLat,
            @RequestParam double startLon,
            @RequestParam double endLat,
            @RequestParam double endLon,
            @RequestParam(required = false) List<Double> viaLat,
            @RequestParam(required = false) List<Double> viaLon,
            @RequestParam(defaultValue = "car_fastest") String profile
    ) {
        List<double[]> waypoints = new ArrayList<>();
        if (viaLat != null && viaLon != null && viaLat.size() == viaLon.size()) {
            for (int i = 0; i < viaLat.size(); i++) {
                waypoints.add(new double[]{viaLat.get(i), viaLon.get(i)});
            }
        }

        MultiRouteRequest request = new MultiRouteRequest(
                startLat, startLon, endLat, endLon, waypoints, profile, null
        );

        return compareMultiRoutingService.compareMultiRoutes(request);
    }

    @GetMapping("/stats")
    public StatsResponse getStats(
            @RequestParam double startLat,
            @RequestParam double startLon,
            @RequestParam double endLat,
            @RequestParam double endLon,
            @RequestParam List<String> vehicles,
            @RequestParam List<String> profiles,
            @RequestParam List<String> algorithms
    ) {
        StatsRequest request = new StatsRequest(startLat, startLon, endLat, endLon, vehicles, profiles, algorithms);
        return statsService.runStats(request);
    }
}
