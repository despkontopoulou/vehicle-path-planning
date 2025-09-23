package com.despkontopoulou.vehiclepathplanning.model.dto;

public record StatsEntry(
    String vehicle,
    String profile,
    String algorithm,
    double totalDistanceKm,
    double totalTimeSec,
    long computationTimeMs,
    long exploredNodes
){}
