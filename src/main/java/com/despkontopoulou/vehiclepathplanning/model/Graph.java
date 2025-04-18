package com.despkontopoulou.vehiclepathplanning.model;

import java.util.HashMap;
import java.util.Map;

public class Graph {
    private final Map<Long, Map<Long, Double>> graph = new HashMap<>();
    private final Map<Long, Coordinate> coordinates = new HashMap<>();
}
