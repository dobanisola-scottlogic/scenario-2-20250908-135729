package com.scottlogic.hackathon.game.engine.models;

import com.scottlogic.hackathon.game.Bot;
import com.scottlogic.hackathon.game.DisqualifiedBot;
import com.scottlogic.hackathon.game.RejectedMove;

import java.util.Collections;
import java.util.List;

public class DisqualifiedBotImpl implements DisqualifiedBot {
    private final Bot bot;
    private final List<RejectedMove> rejectedMoves;

    public DisqualifiedBotImpl(final Bot bot, final List<RejectedMove> rejectedMoves) {
        this.bot = bot;
        this.rejectedMoves = rejectedMoves;
    }

    public List<RejectedMove> getRejectedMoves() {
        return Collections.unmodifiableList(rejectedMoves);
    }

    public Bot getBot() {
        return bot;
    }
}
