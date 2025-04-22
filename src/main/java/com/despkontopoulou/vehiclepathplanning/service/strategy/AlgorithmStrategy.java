package com.despkontopoulou.vehiclepathplanning.service.strategy;

import com.despkontopoulou.vehiclepathplanning.model.Node;

import java.util.List;

public interface AlgorithmStrategy {
    List<Node> findPath(Node start, Node end);
}
