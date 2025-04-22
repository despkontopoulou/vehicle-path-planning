package com.despkontopoulou.vehiclepathplanning.adapter;

import com.despkontopoulou.vehiclepathplanning.model.Coordinate;
import com.despkontopoulou.vehiclepathplanning.model.Node;
import com.despkontopoulou.vehiclepathplanning.service.graph.RoutingGraph;
import com.graphhopper.GraphHopper;
import com.graphhopper.routing.ev.BooleanEncodedValue;
import com.graphhopper.routing.ev.EncodedValueLookup;
import com.graphhopper.storage.BaseGraph;
import com.graphhopper.storage.NodeAccess;
import com.graphhopper.util.EdgeExplorer;
import com.graphhopper.util.EdgeIterator;

import java.util.HashMap;
import java.util.Map;

public class GHRoutingGraphAdapter implements RoutingGraph {
    private final BaseGraph baseGraph;
    private final NodeAccess nodeAccess;
    private final EdgeExplorer edgeExplorer;
    private final BooleanEncodedValue accessEnc;

    public GHRoutingGraphAdapter(GraphHopper hopper){
        this.baseGraph= hopper.getBaseGraph();
        this.nodeAccess = baseGraph.getNodeAccess();
        this.edgeExplorer=baseGraph.createEdgeExplorer();

        EncodedValueLookup evLookup= hopper.getEncodingManager();
        this.accessEnc = evLookup.getBooleanEncodedValue("car_access");
    }

    @Override
    public Coordinate getCoordinatesOfNode(Long nodeId) {
        double lat=nodeAccess.getLat(Math.toIntExact(nodeId));
        double lon=nodeAccess.getLon(Math.toIntExact(nodeId));
        return new Coordinate(lat, lon);
    }

    @Override
    public Map<Long, Double> getNeighboursofNode(Long nodeId){
        Map<Long, Double> neighbours=new HashMap<>();
        EdgeIterator iter = edgeExplorer.setBaseNode(Math.toIntExact(nodeId));//set starting node

        while(iter.next()){//iterate over all neighbouring edges
            int neighbourId=iter.getAdjNode();
            boolean accessible=iter.get(accessEnc);
            if(accessible){//check if an edge is accessible, maybe its a one-way
                double distance=iter.getDistance();
                neighbours.put((long)neighbourId, distance);//if its is accessible, add to neighbours
            }
        }
        return neighbours;//return neighbour node ids and edge weights
    }

    @Override
    public Node getNode(Long nodeId) {
        return new Node(nodeId, getCoordinatesOfNode(nodeId));
    }

}
