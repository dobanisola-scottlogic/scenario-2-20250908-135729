package com.scottlogic.hackathon.game;

import java.util.List;

public interface DisqualifiedBot {
    List<RejectedMove> getRejectedMoves();
    Bot getBot();
}
