package com.despkontopoulou.vehiclepathplanning.controller;

import com.despkontopoulou.vehiclepathplanning.model.dto.request.RouteRequest;
import com.despkontopoulou.vehiclepathplanning.model.dto.response.CompareRouteResponse;
import com.despkontopoulou.vehiclepathplanning.model.dto.response.RouteResponse;
import com.despkontopoulou.vehiclepathplanning.service.CompareRoutingService;
import com.despkontopoulou.vehiclepathplanning.service.RoutingService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/routes")
public class PathfindingController {

    private RoutingService routingService;
    private CompareRoutingService compareRoutingService;

    public PathfindingController(RoutingService routingService,
                                 CompareRoutingService compareRoutingService) {
        this.routingService = routingService;
        this.compareRoutingService = compareRoutingService;
    }

    @GetMapping //for testing, TODO: maybe remove
    public RouteResponse getRoute(
            @RequestParam double startLat,
            @RequestParam double startLon,
            @RequestParam double endLat,
            @RequestParam double endLon,
            @RequestParam(defaultValue = "car-fastest") String profile
    ){
        RouteRequest request = new RouteRequest(startLat, startLon, endLat, endLon, profile);
        return routingService.getRoute(request);
    }

    // GET /api/routes/compare
    @GetMapping("/compare")
    public CompareRouteResponse compareRoutes(
            @RequestParam double startLat,
            @RequestParam double startLon,
            @RequestParam double endLat,
            @RequestParam double endLon
    ) {
        RouteRequest request = new RouteRequest(startLat, startLon, endLat, endLon, "car_fastest");
        return compareRoutingService.compareRoutes(request);
    }
}
