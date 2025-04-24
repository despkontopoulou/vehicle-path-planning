package com.despkontopoulou.vehiclepathplanning.adapter;

import com.despkontopoulou.vehiclepathplanning.model.Coordinate;
import com.despkontopoulou.vehiclepathplanning.model.Node;
import com.despkontopoulou.vehiclepathplanning.model.RoutePreference;
import com.despkontopoulou.vehiclepathplanning.service.graph.RoutingGraph;
import com.graphhopper.GraphHopper;
import com.graphhopper.routing.ev.BooleanEncodedValue;
import com.graphhopper.routing.ev.DecimalEncodedValue;
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
    private final DecimalEncodedValue speedEnc;
    private final RoutePreference pref;

    public GHRoutingGraphAdapter(GraphHopper hopper, RoutePreference preference){
        this.baseGraph= hopper.getBaseGraph();
        this.nodeAccess = baseGraph.getNodeAccess();
        this.edgeExplorer=baseGraph.createEdgeExplorer();
        this.pref=preference;

        EncodedValueLookup evLookup= hopper.getEncodingManager();
        this.accessEnc = evLookup.getBooleanEncodedValue("car_access");
        this.speedEnc= evLookup.getDecimalEncodedValue("car_average_speed");
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
                double speed = iter.get(speedEnc);
                double weight= switch(pref){
                    case SHORTEST -> distance;
                    case FASTEST -> distance/(speed*1000.0/3600.0);//m/s
                    case ECO -> estimatedFuelCost(distance,speed);
                };
                neighbours.put((long) neighbourId, weight);
            }
        }
        return neighbours;//return neighbour node ids and edge weights
    }
    private double estimatedFuelCost(double distance, double speedkmh){/// can be improved
        double speed=speedkmh*1000.0/3600.0;//m/s
        double efficiency=(speed<15) ? 1.2 : (speed>30) ? 1.5 : 1.0;
        return distance*efficiency;
    }

    @Override
    public Node getNode(Long nodeId) {
        return new Node(nodeId, getCoordinatesOfNode(nodeId));
    }

}
