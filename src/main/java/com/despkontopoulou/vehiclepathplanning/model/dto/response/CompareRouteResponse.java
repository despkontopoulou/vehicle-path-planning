package com.despkontopoulou.vehiclepathplanning.model.dto.response;

import java.util.Map;

public record CompareRouteResponse(
        Map<String, RouteResponse> routes  // TODO: Check profile → response
) {}
