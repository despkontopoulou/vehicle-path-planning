package com.despkontopoulou.vehiclepathplanning.util;

import com.despkontopoulou.vehiclepathplanning.model.Coordinate;
import com.despkontopoulou.vehiclepathplanning.model.Graph;
import com.graphhopper.GraphHopper;
import com.graphhopper.routing.ev.BooleanEncodedValue;
import com.graphhopper.routing.ev.EncodedValueLookup;
import com.graphhopper.storage.BaseGraph;
import com.graphhopper.storage.NodeAccess;
import com.graphhopper.util.EdgeExplorer;
import com.graphhopper.util.EdgeIterator;
import com.graphhopper.util.GHUtility;


import com.graphhopper.GraphHopperConfig;
import com.graphhopper.config.Profile;

import java.util.List;

public class OSMGraphBuilder {

    private final String osmFilePath="src/main/resources/maps/greece-latest.osm.pbf";
    private final String graphFolder="src/main/resources/maps/graph-cache";

    public GraphHopper loadGraphHopper() {
        GraphHopper hopper = new GraphHopper();

        GraphHopperConfig config = new GraphHopperConfig()
                .putObject("graph.flag_encoders", "car")
                .putObject("graph.location", graphFolder);

        hopper.setGraphHopperLocation(graphFolder);
        hopper.setOSMFile(osmFilePath);
        hopper.setProfiles(
                List.of(new Profile("car").setVehicle("car").setWeighting("fastest"))
        );

        hopper.setStoreOnFlush(true);
        hopper.importOrLoad();

        return hopper;
    }

    public Graph convertToCustomGraph(GraphHopper hopper){
        Graph customGraph = new Graph();

        BaseGraph baseGraph = (BaseGraph) hopper.getBaseGraph(); // Cast to BaseGraph to access internals
        NodeAccess nodeAccess = baseGraph.getNodeAccess();
        EdgeExplorer edgeExplorer = baseGraph.createEdgeExplorer();

        EncodedValueLookup evLookup = hopper.getEncodingManager(); // this replaces FlagEncoder
        BooleanEncodedValue accessEnc = evLookup.getBooleanEncodedValue("car_access"); // THIS is the key change

        int nodeCount = baseGraph.getNodes();

        for (int nodeId = 0; nodeId < nodeCount; nodeId++) {
            double lat = nodeAccess.getLat(nodeId);
            double lon = nodeAccess.getLon(nodeId);
            customGraph.addNode((long) nodeId, new Coordinate(lon, lat));

            EdgeIterator edgeIterator = edgeExplorer.setBaseNode(nodeId);
            while (edgeIterator.next()) {
                int neighborId = edgeIterator.getAdjNode();
                double distance = edgeIterator.getDistance(); // in meters

                // Use accessEnc to check if this direction is allowed
                boolean fwd = edgeIterator.get(accessEnc); // forward direction
                boolean bwd = edgeIterator.getReverse(accessEnc); // backward direction

                if (fwd)
                    customGraph.addEdge((long) nodeId, (long) neighborId, distance);
                if (bwd)
                    customGraph.addEdge((long) neighborId, (long) nodeId, distance);
            }
        }
        return customGraph;
    }
}
