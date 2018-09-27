package com.scottlogic.hackathon.client;

import org.apache.commons.cli.CommandLine;
import org.apache.commons.cli.CommandLineParser;
import org.apache.commons.cli.DefaultParser;
import org.apache.commons.cli.HelpFormatter;
import org.apache.commons.cli.Option;
import org.apache.commons.cli.Options;

import java.util.ArrayList;
import java.util.List;

class ArgumentsBuilder {
    private static final String DEFAULT_MAP = "Easy";
    private static final String DEFAULT_BOT = "Milestone1";
    private final List<String> errors;
    private final String[] arguments;
    private final boolean parsed = false;
    private String map;
    private String[] bots;
    private String className;
    private Options options;
    private Option mapOption;
    private Option botOption;
    private Option classOption;

    public ArgumentsBuilder(final String[] args) {
        errors = new ArrayList<String>();
        arguments = args;
        options = new Options();
    }

    public Arguments create() {
        createOptions();

        Arguments arguments = null;
        if (this.arguments.length < 1) {
            printUsage();
        } else {
            parse();
            validate();
            if (this.errors.size() > 0) {
                printErrors();
            } else {
                arguments = new Arguments(
                        map == null ? DEFAULT_MAP : map,
                        bots == null ? new String[]{DEFAULT_BOT} : bots,
                        className);
            }
        }
        return arguments;
    }

    public Options createOptions() {
        mapOption = Option.builder("m")
                .hasArg()
                .longOpt("map")
                .desc("MapName: a map name (VeryEasy, Easy, Medium, LargeMedium, Hard)\t\t default: Easy")
                .build();

        botOption = Option.builder("b")
                .hasArgs()
                .longOpt("bot")
                .desc("Bot: a bots name to play against (Default, Milestone1, Milestone2, Milestone3)\t\tdefault: Milestone1. " +
                        "Can set multiple E.G -b Milestone1 Milestone2 Milestone3")
                .build();

        classOption = Option.builder("c")
                .hasArg()
                .longOpt("className")
                .desc("ClassName: full class name (include package) of your bots e.g. com.contestantbots.team.ExampleBot")
                .build();

        options.addOption(mapOption);
        options.addOption(botOption);
        options.addOption(classOption);
        return options;
    }


    public void printUsage() {
        HelpFormatter formatter = new HelpFormatter();
        StringBuilder help = new StringBuilder();
        for (Option option : options.getOptions()) {
            help.append(String.format("[%s|%s %s] ", option.getOpt(), option.getLongOpt(), option.getDescription().split(":")[0]));
        }
        formatter.printHelp(help.toString(), options);

    }

    private void parse() {
        CommandLineParser parser = new DefaultParser();
        CommandLine cmd = null;

        try {
            cmd = parser.parse(options, arguments);

            if (cmd.hasOption(mapOption.getOpt())) {
                map = cmd.getOptionValue(mapOption.getOpt());
            }

            if (cmd.hasOption(botOption.getOpt())) {
                bots = cmd.getOptionValues(botOption.getOpt());
            }

            if (cmd.hasOption(classOption.getOpt())) {
                className = cmd.getOptionValue(classOption.getOpt());
            } else {
                List<String> additionalArgs = cmd.getArgList();
                if (additionalArgs.size() > 0) {
                    className = additionalArgs.get(0);
                }
            }

        } catch (Exception e) {
            printUsage();
            printErrors();
        }
    }

    private void validate() {
        if (className == null) {
            errors.add("class name must be provided");
        }
    }

    public void printErrors() {
        errors.forEach(error -> {
            System.err.println(error);
        });
    }

}