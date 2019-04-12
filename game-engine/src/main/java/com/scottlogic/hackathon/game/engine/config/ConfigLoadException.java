package com.scottlogic.hackathon.game.engine.config;

public class ConfigLoadException extends RuntimeException {
    public ConfigLoadException() {
        super();
    }

    public ConfigLoadException(String s) {
        super(s);
    }
}
