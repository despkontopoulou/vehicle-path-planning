package com.despkontopoulou.vehiclepathplanning.model.dto.response;

import com.despkontopoulou.vehiclepathplanning.model.Coordinate;

import java.util.List;

public record RouteResponse(
    List<Coordinate> path,
    double totalDistance,
    double totalTime
) {}
