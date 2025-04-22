package com.despkontopoulou.vehiclepathplanning.model;

public record Node(Long id, Coordinate coords) {//Long for compatibility with java collections and dealing with null values
}
