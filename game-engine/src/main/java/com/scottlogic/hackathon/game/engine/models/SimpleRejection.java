package com.scottlogic.hackathon.game.engine.models;

import com.scottlogic.hackathon.game.Rejection;

import java.util.Objects;

public class SimpleRejection implements Rejection {
    private final String message;

    public SimpleRejection(final String message) {
        this.message = Objects.requireNonNull(message);
    }

    @Override
    public String getMessage() {
        return message;
    }

    @Override
    public String toString() {
        return getMessage();
    }
}
