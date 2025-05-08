package com.despkontopoulou.vehiclepathplanning.model;

import java.util.List;

public record PathResult(
        List<Node> path,
        double totalCost,
        long durationNanos
) {
}
