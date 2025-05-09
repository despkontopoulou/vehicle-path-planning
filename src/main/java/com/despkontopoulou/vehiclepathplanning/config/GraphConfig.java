package com.despkontopoulou.vehiclepathplanning.config;

import com.despkontopoulou.vehiclepathplanning.adapter.GHRoutingGraphAdapter;
import com.despkontopoulou.vehiclepathplanning.adapter.OSMGraphBuilder;
import com.despkontopoulou.vehiclepathplanning.service.graph.RoutingGraph;
import com.graphhopper.GraphHopper;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class GraphConfig { //class to build and cache graphhopper instance at startup
    @Bean
    public GraphHopper graphHopper(OSMGraphBuilder builder) {
        return builder.loadGraphHopper();
    }
    @Bean
    public RoutingGraph routingGraph(GraphHopper graphHopper) {
        return new GHRoutingGraphAdapter(graphHopper);
    }
}
