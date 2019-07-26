package com.contestantbots.team;

import com.contestantbots.util.GameStateLogger;
import com.scottlogic.hackathon.game.Bot;
import com.scottlogic.hackathon.game.Direction;
import com.scottlogic.hackathon.game.GameState;
import com.scottlogic.hackathon.game.Move;
import com.scottlogic.hackathon.game.MoveImpl;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

public class ExampleBot extends Bot {
    private GameStateLogger.GameStateLoggerBuilder gameStateLoggerBuilder;

    public ExampleBot(String name) {
        super(name);
        gameStateLoggerBuilder = GameStateLogger.configure(getId());
    }

    @Override
    public List<Move> makeMoves(final GameState gameState) {
        List<Move> moves = new ArrayList<>();

        moves.addAll(doExplore(gameState));

        return moves;
    }

    private List<Move> doExplore(final GameState gameState) {
        List<Move> exploreMoves = new ArrayList<>();

        exploreMoves.addAll(gameState.getPlayers().stream()
                .map(player -> new MoveImpl(player.getId(), Direction.NORTH))
                .collect(Collectors.toList()));

        System.out.println(exploreMoves.size() + " players exploring");
        return exploreMoves;
    }
}
