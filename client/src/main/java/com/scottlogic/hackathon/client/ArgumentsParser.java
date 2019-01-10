package com.scottlogic.hackathon.client;

import org.apache.commons.cli.CommandLine;
import org.apache.commons.cli.DefaultParser;
import org.apache.commons.cli.HelpFormatter;
import org.apache.commons.cli.MissingArgumentException;
import org.apache.commons.cli.Option;
import org.apache.commons.cli.Options;
import org.apache.commons.cli.ParseException;

import java.util.Optional;
import java.util.regex.Pattern;
import java.util.stream.Collectors;
import java.util.stream.Stream;

class ArgumentsParser {
    private static final Pattern WHITESPACE = Pattern.compile("\\s");

    private static final Option MAP = Option.builder("m")
            .hasArg()
            .longOpt("map")
            .desc("MapName: a map name (VeryEasy, Easy, Medium, LargeMedium, Hard, ThreeStar, ThreeStraight)\t\t default: Easy")
            .build()
            ;

    private static final Option BOT = Option.builder("b")
            .hasArgs()
            .longOpt("bot")
            .desc("Bot: a bots name to play against (Default, Milestone1, Milestone2, Milestone3)\t\tdefault: Milestone1. " +
                    "Can set multiple E.G -b Milestone1 Milestone2 Milestone3")
            .build()
            ;

    private static final Option CLASS = Option.builder("c")
            .hasArg()
            .longOpt("className")
            .desc("ClassName: full class name (include package) of your bots e.g. com.contestantbots.team.ExampleBot")
            .build()
            ;

    private static final Option DEBUG = Option.builder("d")
            .longOpt("debug")
            .desc("Debug: if enabled, Bot methods will be invoked synchronously to assist debugging")
            .build()
            ;

    private static final Options OPTIONS = new Options()
            .addOption(MAP)
            .addOption(BOT)
            .addOption(CLASS)
            .addOption(DEBUG);

    private ArgumentsParser() {}

    public static Optional<Arguments> create(Class<?> mainClass, String[] args) {

        try {
            CommandLine cmd = new DefaultParser().parse(OPTIONS, args);

            String[] bots = cmd.getOptionValues(BOT.getOpt());
            if (bots == null || bots.length == 0) {
                bots = new String[]{Arguments.DEFAULT_BOT};
            }

            String className = cmd.getOptionValue(CLASS.getOpt());
            if (className == null) {
                if (cmd.getArgList().isEmpty()) {
                    throw new MissingArgumentException(CLASS);
                }
                className = cmd.getArgList().remove(0);
            }

            if(!cmd.getArgList().isEmpty()) {
                throw new ParseException("Too many arguments on command line: " +
                        Stream.of(args)
                                .map(arg -> WHITESPACE.matcher(arg).find()
                                        ? "'" + arg.replace("'", "'\"'\"'") + "'"
                                        : arg)
                                .collect(Collectors.joining(" ")));
            }

            return Optional.of(Arguments.builder()
                    .setMap(cmd.getOptionValue(MAP.getOpt(), Arguments.DEFAULT_MAP))
                    .setBots(bots)
                    .setClassName(className)
                    .setDebug(cmd.hasOption(DEBUG.getOpt()))
                    .build());

        } catch (ParseException e) {

            System.err.println(e.getLocalizedMessage());

            HelpFormatter formatter = new HelpFormatter();
            formatter.printHelp("java [-cp <CLASSPATH>] " + mainClass.getName(), OPTIONS, true);

            return Optional.empty();
        }
    }

}