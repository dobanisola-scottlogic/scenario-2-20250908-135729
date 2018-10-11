package com.scottlogic.hackathon.client;

import org.apache.commons.cli.*;

import java.util.List;
import java.util.Optional;

class ArgumentsBuilder {

    private static final Option.Builder MAP = Option.builder("m")
            .hasArg()
            .longOpt("map")
            .desc("MapName: a map name (VeryEasy, Easy, Medium, LargeMedium, Hard)\t\t default: Easy")
            ;

    private static final Option.Builder BOT = Option.builder("b")
            .hasArgs()
            .longOpt("bot")
            .desc("Bot: a bots name to play against (Default, Milestone1, Milestone2, Milestone3)\t\tdefault: Milestone1. " +
                    "Can set multiple E.G -b Milestone1 Milestone2 Milestone3")
            ;

    private static final Option.Builder CLASS = Option.builder("c")
            .hasArg()
            .longOpt("className")
            .desc("ClassName: full class name (include package) of your bots e.g. com.contestantbots.team.ExampleBot")
            ;

    private static final Option.Builder DEBUG = Option.builder("d")
            .longOpt("debug")
            .desc("Debug: if enabled, Bot methods will be invoked synchronously to assist debugging")
            ;

    private ArgumentsBuilder() {}

    public static Optional<Arguments> create(String[] args) {

        Option mapOption = MAP.build();
        Option botOption = BOT.build();
        Option classOption = CLASS.build();
        Option debugOption = DEBUG.build();

        Options options = new Options()
                .addOption(mapOption)
                .addOption(botOption)
                .addOption(classOption)
                .addOption(debugOption);

        try {
            List<String> extraArgs = new DefaultParser().parse(options, args)
                    .getArgList();


            String className = classOption.getValue();
            if (className == null) {
                if (extraArgs.isEmpty()) {
                    throw new MissingArgumentException(classOption);
                }
                className = extraArgs.get(0);
            }

            String[] bots = botOption.getValues();
            if (bots == null || bots.length == 0) {
                bots = new String[]{Arguments.DEFAULT_BOT};
            }

            return Optional.of(Arguments.builder()
                    .setMap(mapOption.getValue(Arguments.DEFAULT_MAP))
                    .setBots(bots)
                    .setClassName(className)
                    .setDebug(options.hasOption(debugOption.getOpt()))
                    .build());

        } catch (ParseException e) {
            HelpFormatter formatter = new HelpFormatter();
            StringBuilder help = new StringBuilder();
            for (Option option : options.getOptions()) {
                help.append(String.format("[%s|%s %s] ", option.getOpt(), option.getLongOpt(), option.getDescription().split(":")[0]));
            }
            formatter.printHelp(help.toString(), options);

            return Optional.empty();
        }
    }

}