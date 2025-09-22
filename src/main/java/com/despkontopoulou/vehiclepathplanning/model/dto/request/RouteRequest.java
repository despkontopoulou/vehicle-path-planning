package com.despkontopoulou.vehiclepathplanning.model.dto.request;

public record RouteRequest(
        double startLat,
        double startLon,
        double endLat,
        double endLon,
        String profile,
        String algorithm
) {}
