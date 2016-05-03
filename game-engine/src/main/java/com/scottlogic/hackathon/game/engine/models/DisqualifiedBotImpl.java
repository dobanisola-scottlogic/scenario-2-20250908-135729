package com.scottlogic.hackathon.game.engine.models;

import com.scottlogic.hackathon.game.Bot;
import com.scottlogic.hackathon.game.DisqualifiedBot;
import com.scottlogic.hackathon.game.Rejection;

import java.util.Collections;
import java.util.List;

public class DisqualifiedBotImpl implements DisqualifiedBot {
    private final Bot bot;
    private final List<Rejection> rejections;

    public DisqualifiedBotImpl(final Bot bot, final List<Rejection> rejections) {
        this.bot = bot;
        this.rejections = rejections;
    }

    public List<Rejection> getRejections() {
        return Collections.unmodifiableList(rejections);
    }

    public Bot getBot() {
        return bot;
    }
}
