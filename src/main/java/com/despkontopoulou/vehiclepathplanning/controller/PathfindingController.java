package com.despkontopoulou.vehiclepathplanning.controller;

import com.despkontopoulou.vehiclepathplanning.model.AlgorithmType;
import com.despkontopoulou.vehiclepathplanning.model.Coordinate;
import com.despkontopoulou.vehiclepathplanning.model.PathResult;
import com.despkontopoulou.vehiclepathplanning.model.RoutePreference;
import com.despkontopoulou.vehiclepathplanning.service.PathfindingService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/routes")
public class PathfindingController {
    private final PathfindingService service;

    public PathfindingController(PathfindingService service) {
        this.service = service;
    }

    @GetMapping
    public PathResult route(
            @RequestParam double startLat,
            @RequestParam double startLon,
            @RequestParam double goalLat,
            @RequestParam double goalLon,
            @RequestParam RoutePreference pref,
            @RequestParam AlgorithmType algorithm) {
        Coordinate startCoord = new Coordinate(startLat, startLon);
        Coordinate goalCoord = new Coordinate(goalLat, goalLon);
        return service.findRoute(startCoord, goalCoord, pref, algorithm);
    }

    @GetMapping("/compare")
    public Map<String, PathResult> compare(
            @RequestParam double startLat,
            @RequestParam double startLon,
            @RequestParam double goalLat,
            @RequestParam double goalLon,
            @RequestParam RoutePreference pref){
        Coordinate startCoord = new Coordinate(startLat, startLon);
        Coordinate goalCoord = new Coordinate(goalLat, goalLon);
        return service.compareRoutes(startCoord, goalCoord, pref);
    }

    @GetMapping("/best")
    public PathResult best(
            @RequestParam double startLat,
            @RequestParam double startLon,
            @RequestParam double goalLat,
            @RequestParam double goalLon,
            @RequestParam RoutePreference pref) {
        Coordinate startCoord = new Coordinate(startLat, startLon);
        Coordinate goalCoord = new Coordinate(goalLat, goalLon);
        return service.bestRoute(startCoord, goalCoord, pref);
    }
}
