package com.despkontopoulou.vehiclepathplanning.adapter;

import com.despkontopoulou.vehiclepathplanning.model.Coordinate;
import com.despkontopoulou.vehiclepathplanning.model.EdgeData;
import com.despkontopoulou.vehiclepathplanning.model.Node;
import com.despkontopoulou.vehiclepathplanning.service.graph.RoutingGraph;
import com.graphhopper.GraphHopper;
import com.graphhopper.routing.ev.BooleanEncodedValue;
import com.graphhopper.routing.ev.DecimalEncodedValue;
import com.graphhopper.routing.ev.EncodedValueLookup;
import com.graphhopper.routing.util.EdgeFilter;
import com.graphhopper.storage.BaseGraph;
import com.graphhopper.storage.NodeAccess;
import com.graphhopper.storage.index.LocationIndex;
import com.graphhopper.storage.index.Snap;
import com.graphhopper.util.EdgeExplorer;
import com.graphhopper.util.EdgeIterator;

import java.util.HashMap;
import java.util.Map;

public class GHRoutingGraphAdapter implements RoutingGraph {
    private final NodeAccess nodeAccess;
    private final EdgeExplorer edgeExplorer;
    private final BooleanEncodedValue accessEnc;
    private final DecimalEncodedValue speedEnc;
    private final LocationIndex locationIndex;


    public GHRoutingGraphAdapter(GraphHopper hopper){
        BaseGraph baseGraph= hopper.getBaseGraph();
        this.nodeAccess = baseGraph.getNodeAccess();
        this.edgeExplorer=baseGraph.createEdgeExplorer();

        EncodedValueLookup evLookup= hopper.getEncodingManager();
        this.accessEnc = evLookup.getBooleanEncodedValue("car_access");
        this.speedEnc= evLookup.getDecimalEncodedValue("car_average_speed");

        this.locationIndex= hopper.getLocationIndex();
    }

    @Override
    public Coordinate getCoordinatesOfNode(Long nodeId) {
        double lat=nodeAccess.getLat(Math.toIntExact(nodeId));
        double lon=nodeAccess.getLon(Math.toIntExact(nodeId));
        return new Coordinate(lat, lon);
    }

    @Override
    public Map<Long, EdgeData> getEdges(Long nodeId){
        Map<Long, EdgeData> edges = new HashMap<>();
        EdgeIterator iter= edgeExplorer.setBaseNode(nodeId.intValue());
        while (iter.next()) {
            if (!iter.get(accessEnc)) continue;
            long neighbour     = iter.getAdjNode();
            double dist  = iter.getDistance();
            double speed = iter.get(speedEnc);
            edges.put(neighbour, new EdgeData(dist, speed));
        }
        return edges;
    }

    @Override
    public Node getNode(Long nodeId) {
        return new Node(nodeId, getCoordinatesOfNode(nodeId));
    }

    @Override
    public Node getClosestNode(Coordinate coordinate){
        Snap snap = locationIndex.findClosest(
                coordinate.latitude(),
                coordinate.longitude(),
                EdgeFilter.ALL_EDGES
        );
        int nodeId=snap.getClosestNode();
        return getNode((long) nodeId);
    }

}
