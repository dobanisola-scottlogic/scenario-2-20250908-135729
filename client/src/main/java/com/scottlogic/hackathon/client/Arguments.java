package com.scottlogic.hackathon.client;


class Arguments {
    private final String map;
    private final String[] bots;
    private final String className;

    Arguments(final String map, final String[] bots, final String className) {
        this.map = map;
        this.bots = bots;
        this.className = className;
    }

    public String getMap() {
        return map;
    }

    public String[] getBots() {
        return bots;
    }

    public String getClassName() {
        return className;
    }
}
