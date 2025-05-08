package com.despkontopoulou.vehiclepathplanning.service.strategy;

import com.despkontopoulou.vehiclepathplanning.model.Node;
import com.despkontopoulou.vehiclepathplanning.model.PathResult;
import com.despkontopoulou.vehiclepathplanning.service.graph.RoutingGraph;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Map;

public interface AlgorithmStrategy {
    PathResult findPath(Node start, Node end);

    default List<Node> reconstructPath(Map<Long, Long> parent, Node goal, RoutingGraph graph) {
        List<Node> path = new ArrayList<>();
        for (Long at = goal.id(); at != null; at = parent.get(at)) {
            path.add(graph.getNode(at));
        }
        Collections.reverse(path);
        return path;
    }
}
