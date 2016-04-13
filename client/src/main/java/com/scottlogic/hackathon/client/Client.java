package com.scottlogic.hackathon.client;

import com.scottlogic.hackathon.bots.ConsistentRandomBot;
import com.scottlogic.hackathon.game.*;
import com.scottlogic.hackathon.game.engine.GameEngine;
import org.fusesource.jansi.AnsiConsole;

import java.util.*;
import java.util.Map;
import java.util.stream.Collectors;

public class Client {
    public static void main(final String[] args) throws Exception {
        AnsiConsole.systemInstall();
        new Client().run(args);
    }

    private void run(final String[] args) {
        final Set<Bot> bots = new HashSet<Bot>();
        bots.add(new ConsistentRandomBot());
        bots.add(new ConsistentRandomBot());
        bots.add(new ConsistentRandomBot());
        bots.add(new ConsistentRandomBot());

        final GameEngine gameEngine = GameEngine.create("FourPlayerCross", bots);
        try {
            final GameResult gameResult = gameEngine.play();

            printGameResult(gameResult);

            final Scanner scanner = new Scanner(System.in);
            System.out.println("Type p to play or press enter to quit");
            if (scanner.hasNext("p")) {
                for (final PhaseResult phaseResult : gameResult.getPhaseResults()) {
                    final PhaseResultPrinter phaseResultPrinter = new PhaseResultPrinter(bots, gameResult, phaseResult);
                    phaseResultPrinter.print();
                    System.out.println("Press enter to continue");
                    scanner.nextLine();
                }
            }
        } catch (final Exception ex) {
            System.out.println(ex);
            ex.printStackTrace(System.out);
        }
    }

    private void printGameResult(final GameResult gameResult) {
        final PhaseResult finalResult = gameResult.getPhaseResults().get(gameResult.getPhaseResults().size() - 1);
        System.out.printf("Game completed in %s phases", finalResult.getPhase())
                .println();

        System.out.printf("Ended because %s", gameResult.getCutoffCondition().toString())
                .println();

        System.out.printf("The game has %s spawn points, %s players and %s collectables left",
                finalResult.getSpawnPoints().size(),
                finalResult.getPlayers().size(),
                finalResult.getCollectables().size())
                .println();

        final Map<UUID, List<Player>> ownerToPlayerLookup = finalResult.getPlayers()
                .stream()
                .collect(Collectors.groupingBy(player -> player.getOwner()));
        for (final Map.Entry<UUID, List<Player>> entry : ownerToPlayerLookup.entrySet()) {
            System.out.printf("\tBot %s has %s players left",
                    entry.getKey(),
                    entry.getValue().size())
                    .println();
        }

        if (finalResult.getDisqualifiedBots().size() > 0) {
            System.out.printf("Game had %s bots disqualified", finalResult.getDisqualifiedBots().size())
                    .println();
            for (final DisqualifiedBot disqualifiedBot : finalResult.getDisqualifiedBots()) {
                System.out.printf("\tBot %s was disqualified", disqualifiedBot.getBot().getId())
                        .println();
                for (final RejectedMove rejectedMove : disqualifiedBot.getRejectedMoves()) {
                    System.out.printf("\t\tMove %s - Message %s", rejectedMove.getMove(), rejectedMove.getMessage())
                            .println();
                }
            }
        }
    }
}

