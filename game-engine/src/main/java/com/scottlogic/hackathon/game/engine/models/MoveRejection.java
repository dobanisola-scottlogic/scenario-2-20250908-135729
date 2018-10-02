package com.scottlogic.hackathon.game.engine.models;

import com.scottlogic.hackathon.game.Move;
import com.scottlogic.hackathon.game.Rejection;

public class MoveRejection implements Rejection {
    private final Move move;
    private final String moveMessage;

    public MoveRejection(final Move move, final String moveMessage) {
        this.move = move;
        this.moveMessage = moveMessage;
    }

    public Move getMove() {
        return move;
    }

    public String getMoveMessage() {
        return moveMessage;
    }

    @Override
    public String getMessage() {
        return String.format("Move %s - %s", move, moveMessage);
    }

    @Override
    public String toString() {
        return getMessage();
    }
}
