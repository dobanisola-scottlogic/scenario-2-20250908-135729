package com.scottlogic.hackathon.client;


class Arguments {
    private final String map;
    private final String bot;
    private final String className;

    Arguments(final String map, final String bot, final String className) {
        this.map = map;
        this.bot = bot;
        this.className = className;
    }

    public String getMap() {
        return map;
    }

    public String getBot() {
        return bot;
    }

    public String getClassName() {
        return className;
    }
}
