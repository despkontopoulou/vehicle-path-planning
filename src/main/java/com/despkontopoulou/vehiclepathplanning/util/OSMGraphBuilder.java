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
import com.graphhopper.config.Profile;
import java.util.List;

public class OSMGraphBuilder {

    private final String osmFilePath="src/main/resources/maps/greece-latest.osm.pbf"; //where raw map file is
    private final String graphFolder="src/main/resources/maps/graph-cache";//where the compiled graph will be stored

    public GraphHopper loadGraphHopper() {
        GraphHopper hopper = new GraphHopper(); //creation of graphhopper instance
        hopper.setGraphHopperLocation(graphFolder); // where to read/write processed graph files
        hopper.setOSMFile(osmFilePath); // where raw map of file is
        hopper.setProfiles(
                List.of(new Profile("car").setVehicle("car").setWeighting("fastest"))//set car as type of vehicle and fastest as weighting (for now)
        );
        hopper.setStoreOnFlush(true);//after first run store graph in graphfolder
        hopper.importOrLoad();//if no graph is cached import osm file, else just load cached
        return hopper; //return graphhopper instance
    }

}
