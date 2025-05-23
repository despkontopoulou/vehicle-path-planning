package com.despkontopoulou.vehiclepathplanning.adapter;


import com.graphhopper.GraphHopper;

import com.graphhopper.config.Profile;
import com.graphhopper.util.CustomModel;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class OSMGraphBuilder {

    private final String osmFilePath="src/main/resources/maps/greece-latest.osm.pbf"; //where raw map file is
    private final String graphFolder="src/main/resources/maps/graph-cache";//where the compiled graph will be stored

    public GraphHopper loadGraphHopper() {
        GraphHopper hopper = new GraphHopper(); //creation of graphhopper instance
        hopper.setGraphHopperLocation(graphFolder); // where to read/write processed graph files
        hopper.setOSMFile(osmFilePath); // where raw map of file is
        hopper.setProfiles(
                List.of(new Profile("car").setVehicle("car").setWeighting("custom").setCustomModel(new CustomModel()))//set car as type of vehicle and fastest as weighting (for now)
        );
        hopper.setStoreOnFlush(true);//after first run store graph in graphfolder
        hopper.importOrLoad();//if no graph is cached import osm file, else just load cached
        return hopper; //return graphhopper instance
    }

}
