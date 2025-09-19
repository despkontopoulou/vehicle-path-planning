package com.despkontopoulou.vehiclepathplanning.utils;

import com.despkontopoulou.vehiclepathplanning.model.Coordinate;
import com.despkontopoulou.vehiclepathplanning.model.dto.response.RouteResponse;
import com.graphhopper.ResponsePath;
import com.graphhopper.util.PointList;

import java.util.List;
import java.util.stream.Collectors;

public class GraphHopperMapper {

    public static RouteResponse toRouteResponse(ResponsePath path) {
        double distanceKm = path.getDistance() / 1000.0;
        double timeSeconds = path.getTime() / 1000.0;

        PointList points = path.getPoints();
        List<Coordinate> coords =
                java.util.stream.IntStream.range(0, points.size())
                        .mapToObj(i -> new Coordinate(points.getLat(i), points.getLon(i)))
                        .collect(Collectors.toList());

        return new RouteResponse(coords, distanceKm, timeSeconds);
    }
}
