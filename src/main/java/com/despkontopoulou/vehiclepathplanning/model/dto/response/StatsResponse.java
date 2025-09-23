package com.despkontopoulou.vehiclepathplanning.model.dto.response;

import com.despkontopoulou.vehiclepathplanning.model.dto.StatsEntry;

import java.util.List;

public record StatsResponse (
    List<StatsEntry> results
){}

