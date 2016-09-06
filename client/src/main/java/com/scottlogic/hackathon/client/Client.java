package com.scottlogic.hackathon.client;

import com.scottlogic.hackathon.bots.DefaultBot;
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
        final ArgumentsBuilder argumentsBuilder = new ArgumentsBuilder(args);
        final Arguments arguments = argumentsBuilder.create();

        if (arguments != null) {
            final Bot defaultBot = loadDefaultBot(arguments.getBot());
            final Bot bot = loadBot(arguments.getClassName());

            if (bot != null && defaultBot != null) {
                final Set<Bot> bots = new HashSet<Bot>();

                bots.add(defaultBot);
                bots.add(bot);

                GameEngine gameEngine = null;
                try {
                    gameEngine = GameEngine.create(arguments.getMap(), bots);
                } catch (final IllegalArgumentException e) {
                    System.err.printf("couldn't create map %s", arguments.getMap())
                            .println();
                }

                if (gameEngine != null) {
                    try {
                        final GameResult gameResult = gameEngine.play();

                        printGameResult(gameResult, bot);

                        final Scanner scanner = new Scanner(System.in);
                        System.out.println("Type p to play or press enter to quit");
                        if (scanner.nextLine().equals("p")) {
                            final List<PhaseResult> phaseResults = gameResult.getPhaseResults();
                            int phase = 1;
                            while (phase < phaseResults.size()) {
                                final PhaseResultPrinter phaseResultPrinter = new PhaseResultPrinter(bots, gameResult, phaseResults.get(phase));
                                phaseResultPrinter.print();
                                System.out.println("Type q to quit, a number to jump to a phase or press enter to continue");

                                final String input = scanner.nextLine();
                                if (input.equals("q")) {
                                    phase = phaseResults.size();
                                } else {
                                    try {
                                        final int nextPhase = Integer.parseInt(input);
                                        if (nextPhase < 0 || nextPhase >= phaseResults.size()) {
                                            System.out.println("Phase out of range");
                                        } else {
                                            phase = nextPhase + 1;
                                        }
                                    } catch (final Exception ex) {
                                        phase++;
                                    }
                                }
                            }
                        }
                        scanner.close();
                        System.exit(0);
                    } catch (final Exception ex) {
                        System.out.println(ex);
                        ex.printStackTrace(System.out);
                        System.exit(1);
                    } finally {
                        gameEngine.dispose();
                    }
                }
            }
        }
    }

    Bot loadDefaultBot(final String botName) {
        return loadBot(DefaultBot.class.getPackage().getName() + "." + botName + "Bot");
    }

    Bot loadBot(final String className) {
        Bot bot = null;
        try {
            final Class clazz = Class.forName(className);
            bot = (Bot) clazz.newInstance();
        } catch (final Exception e) {
            System.err.printf("bot %s wasn't found", className)
                    .println();
        }
        return bot;
    }

    private void printGameResult(final GameResult gameResult, Bot bot) {
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
        for (final List<Player> players : ownerToPlayerLookup.values()) {
            System.out.printf("\t%s has %s players left",
                    bot.getDisplayName(),
                    players.size())
                    .println();
        }

        if (finalResult.getDisqualifiedBots().size() > 0) {
            System.out.printf("Game had %s bots disqualified", finalResult.getDisqualifiedBots().size())
                    .println();
            for (final DisqualifiedBot disqualifiedBot : finalResult.getDisqualifiedBots()) {
                System.out.printf("\tBot %s was disqualified", disqualifiedBot.getBot().getId())
                        .println();
                for (final Rejection rejection : disqualifiedBot.getRejections()) {
                    System.out.printf("\t\t%s", rejection.getMessage())
                            .println();
                }
            }
        }
    }
}

