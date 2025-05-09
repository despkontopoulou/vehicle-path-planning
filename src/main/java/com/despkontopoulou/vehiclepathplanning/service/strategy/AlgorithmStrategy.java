package com.despkontopoulou.vehiclepathplanning.service.strategy;

import com.despkontopoulou.vehiclepathplanning.model.EdgeData;
import com.despkontopoulou.vehiclepathplanning.model.Node;
import com.despkontopoulou.vehiclepathplanning.model.PathResult;
import com.despkontopoulou.vehiclepathplanning.model.RoutePreference;
import com.despkontopoulou.vehiclepathplanning.service.graph.RoutingGraph;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Map;


public interface AlgorithmStrategy {
    PathResult findPath(Node start, Node end, RoutePreference routePreference);

    default List<Node> reconstructPath(Map<Long, Long> parent, Node goal, RoutingGraph graph) {
        List<Node> path = new ArrayList<>();
        for (Long at = goal.id(); at != null; at = parent.get(at)) {
            path.add(graph.getNode(at));
        }
        Collections.reverse(path);
        return path;
    }
    default double computeWeight(EdgeData edge, RoutePreference pref) {
        double dist = edge.distance();
        double speedMs = edge.speedKmh() * 1000.0 / 3600.0;
        return switch(pref) {
            case SHORTEST -> dist;
            case FASTEST  -> dist / speedMs;
            case ECO      -> {
                double efficiency = (speedMs <  15) ? 1.2
                        : (speedMs > 30) ? 1.5
                        : 1.0;
                yield dist * efficiency;
            }
        };
    }
}
