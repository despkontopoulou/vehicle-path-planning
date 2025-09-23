package com.despkontopoulou.vehiclepathplanning.model.dto.request;

import java.util.List;

public record MultiRouteRequest (
    double startLat,
    double startLon,
    double endLat,
    double endLon,
    List<double[]> waypoints,
    String profile,
    String algorithm
    ){}
