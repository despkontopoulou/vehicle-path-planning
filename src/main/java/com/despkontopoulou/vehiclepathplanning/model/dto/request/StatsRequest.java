package com.despkontopoulou.vehiclepathplanning.model.dto.request;

import java.util.List;

public record StatsRequest (
        double startLat,
        double startLon,
        double endLat,
        double endLon,
        List<String> vehicles,
        List<String> profiles,
        List<String> algorithms
){}
