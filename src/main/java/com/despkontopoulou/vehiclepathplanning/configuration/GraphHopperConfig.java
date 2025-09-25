package com.despkontopoulou.vehiclepathplanning.configuration;

import com.graphhopper.GraphHopper;
import com.graphhopper.config.Profile;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
public class GraphHopperConfig {

    @Value("${graphhopper.osm-file}")
    private String osmFile;

    @Value("${graphhopper.graph-location}")
    private String graphLocation;

    @Bean
    public GraphHopper graphHopper() {
        GraphHopper hopper = new GraphHopper()
                .setOSMFile(osmFile)
                .setGraphHopperLocation(graphLocation);

        hopper.setProfiles(List.of(
                new Profile("car_fastest").setVehicle("car").setWeighting("fastest"),
                new Profile("car_shortest").setVehicle("car").setWeighting("shortest"),

                new Profile("bike_fastest").setVehicle("bike").setWeighting("fastest"),
                new Profile("bike_shortest").setVehicle("bike").setWeighting("shortest"),

                new Profile("foot_fastest").setVehicle("foot").setWeighting("fastest"),
                new Profile("foot_shortest").setVehicle("foot").setWeighting("shortest")
        ));

        hopper.importOrLoad();
        return hopper;
    }
}
