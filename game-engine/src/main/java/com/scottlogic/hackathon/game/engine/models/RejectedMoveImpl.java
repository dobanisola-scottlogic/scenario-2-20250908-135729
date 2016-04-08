package com.scottlogic.hackathon.game.engine.models;

import com.scottlogic.hackathon.game.Move;
import com.scottlogic.hackathon.game.RejectedMove;

public class RejectedMoveImpl implements RejectedMove {
    private final Move move;
    private final String message;

    public RejectedMoveImpl(final Move move, final String message) {
        this.move = move;
        this.message = message;
    }

    @Override
    public Move getMove() {
        return move;
    }

    @Override
    public String getMessage() {
        return message;
    }
}
