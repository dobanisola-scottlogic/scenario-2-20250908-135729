package com.scottlogic.hackathon.game.engine.maps;

public class MapLoadException extends RuntimeException {
    public MapLoadException() {
        super();
    }

    public MapLoadException(String s) {
        super(s);
    }
}
