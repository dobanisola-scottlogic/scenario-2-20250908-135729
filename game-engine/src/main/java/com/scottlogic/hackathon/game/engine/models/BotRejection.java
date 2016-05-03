package com.scottlogic.hackathon.game.engine.models;

import com.scottlogic.hackathon.game.Move;
import com.scottlogic.hackathon.game.Rejection;

public class BotRejection implements Rejection {
    private final String message;

    public BotRejection(final String message) {
        this.message = message;
    }

    @Override
    public String getMessage() {
        return message;
    }
}
