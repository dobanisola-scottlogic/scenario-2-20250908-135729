package com.scottlogic.hackathon.client;

import com.scottlogic.hackathon.bots.DefaultBot;
import com.scottlogic.hackathon.game.Bot;
import com.scottlogic.hackathon.game.DisqualifiedBot;
import com.scottlogic.hackathon.game.GameResult;
import com.scottlogic.hackathon.game.PhaseResult;
import com.scottlogic.hackathon.game.Player;
import com.scottlogic.hackathon.game.Rejection;
import com.scottlogic.hackathon.game.engine.GameEngine;
import com.scottlogic.hackathon.game.engine.config.GameConfig;
import com.scottlogic.hackathon.game.engine.config.GameConfigFileReader;
import com.scottlogic.hackathon.game.engine.config.GameConfigLayer;
import com.scottlogic.hackathon.game.engine.config.GameConfigLayerBuilder;
import com.scottlogic.hackathon.game.engine.maps.Arena;
import com.scottlogic.hackathon.game.engine.maps.MapFileReader;
import com.scottlogic.hackathon.game.engine.maps.MapLoadException;
import org.fusesource.jansi.AnsiConsole;

import java.lang.reflect.Constructor;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Scanner;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;
import java.util.stream.Stream;

public class Client {

    public static void main(final String[] args) throws Exception {
        AnsiConsole.systemInstall();
        new Client().run(args);
    }

    private void run(final String[] args) throws Exception {
        Optional<Arguments> optArgs = ArgumentsParser.create(getClass(), args);
        if (optArgs.isPresent()) {
            Arguments arguments = optArgs.get();

            final Set<Bot> bots = Stream.of(arguments.getBots())
                .map(this::loadDefaultBot)
                .collect(Collectors.toCollection(HashSet::new));
            bots.add(loadBot(arguments.getClassName()));

            final Arena arena;
            try {
                arena = new MapFileReader().readMapFile(arguments.getMap());
            } catch (final MapLoadException e) {
                System.err.printf("couldn't create map %s: %s", arguments.getMap(), e.getMessage())
                    .println();

                return;
            }

            final GameConfigLayer configFromConfigFile = new GameConfigFileReader()
                .readIfExists("forced-overrides.properties")
                .orElse(GameConfigLayerBuilder.createEmpty());

            GameEngine gameEngine = arguments.isDebug()
                ? GameEngine.createDebug(configFromConfigFile, arena, bots)
                : GameEngine.create(configFromConfigFile, arena, bots);

            try {
                final Scanner scanner = new Scanner(System.in);
                final PhaseResultPrinter phaseResultPrinter = new PhaseResultPrinter(bots, arena);
                final GameResult gameResult = gameEngine.play((phase, cutoff) -> {
                    phaseResultPrinter.print(phase, 0);
                    System.out.println("Type 'q' to quit or press enter to continue");
                    return !scanner.nextLine().equals("q");
                });

                printGameResult(gameResult, bots);

                System.out.println("Type 'p' to review game steps or press enter to quit");
                if (scanner.nextLine().equals("p")) {
                    final List<PhaseResult> phaseResults = gameResult.getPhaseResults();
                    int phase = 1;
                    while (phase < phaseResults.size()) {
                        phaseResultPrinter.print(phaseResults.get(phase), phaseResults.size());
                        System.out.println("Type 'q' to quit, a number to jump to a phase or press enter to continue");

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
                ex.printStackTrace(System.out);
                System.exit(1);
            } finally {
                gameEngine.dispose();
            }
        }
    }

    private Bot loadDefaultBot(final String botName) {
        try {
            return loadBot(DefaultBot.class.getPackage().getName() + "." + botName + "Bot");
        } catch (Exception e) {
            throw new IllegalArgumentException("Invalid built-in bot name: " + botName, e);
        }
    }

    @SuppressWarnings("unchecked")
    private Bot loadBot(final String className) throws Exception {
        final Class<? extends Bot> clazz = (Class<? extends Bot>) Class.forName(className);
        Constructor<? extends Bot> constructor = clazz.getConstructor();
        return constructor.newInstance();
    }

    private void printGameResult(final GameResult gameResult, Set<Bot> bots) {
        final PhaseResult finalResult = gameResult.getPhaseResults().get(gameResult.getPhaseResults().size() - 1);
        System.out.printf("Game completed in %s phases", finalResult.getPhase())
                .println();

        System.out.printf("Ended because %s", gameResult.getCutoffCondition())
                .println();

        System.out.printf("The game has %s spawn points, %s players and %s collectables left",
                finalResult.getSpawnPoints().size(),
                finalResult.getPlayers().size(),
                finalResult.getCollectables().size())
                .println();

        final Map<UUID, List<Player>> ownerToPlayerLookup = finalResult.getPlayers()
                .stream()
                .collect(Collectors.groupingBy(Player::getOwner));

        for (final Map.Entry<UUID, List<Player>> entry : ownerToPlayerLookup.entrySet()) {
            Bot currentBot = bots
                    .stream()
                    .filter(bot -> bot.getId().equals(entry.getKey()))
                    .findFirst()
                    .orElse(null);

            System.out.printf("\t%s has %s players left",
                    currentBot.getDisplayName(),
                    entry.getValue().size())
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

