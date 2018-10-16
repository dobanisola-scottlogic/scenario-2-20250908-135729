package com.scottlogic.hackathon.client;


import java.util.Objects;

class Arguments {
    static final String DEFAULT_MAP = "Easy";
    static final String DEFAULT_BOT = "Milestone1";
    static final boolean DEFAULT_DEBUG = false;

    private final boolean debug;
    private final String map;
    private final String[] bots;
    private final String className;

    Arguments(boolean debug, String map, String[] bots, String className) {
        this.debug = debug;
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

    public boolean isDebug() {
        return debug;
    }

    static Builder builder() {
        return new Builder();
    }

    static class Builder {
        private boolean debug = DEFAULT_DEBUG;
        private String map = DEFAULT_MAP;
        private String[] bots = new String[]{DEFAULT_BOT};
        private String className;

        private Builder(){}

        public Builder setDebug(boolean debug) {
            this.debug = debug;
            return this;
        }

        public Builder setMap(String mapName) {
            this.map = Objects.requireNonNull(mapName);
            return this;
        }

        public Builder setBots(String[] bots) {
            this.bots = Objects.requireNonNull(bots);
            return this;
        }

        public Builder setClassName(String className) {
            this.className = Objects.requireNonNull(className);
            return this;
        }

        Arguments build() {
            return new Arguments(debug, map, bots, Objects.requireNonNull(className));
        }

    }
}
