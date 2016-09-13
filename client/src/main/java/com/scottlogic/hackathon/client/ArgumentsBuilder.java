package com.scottlogic.hackathon.client;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.LinkedList;
import java.util.List;

class ArgumentsBuilder {
    private static final String DEFAULT_MAP = "Easy";
    private static final String DEFAULT_BOT = "Milestone1";
    private final List<String> errors;
    private final LinkedList<String> arguments;
    private final boolean parsed = false;
    private String map;
    private String bot;
    private String className;

    public ArgumentsBuilder(final String[] args) {
        errors = new ArrayList<String>();
        arguments = new LinkedList<>(Arrays.asList(args));
    }

    public Arguments create() {
        Arguments arguments = null;
        if (this.arguments.isEmpty() || this.arguments.contains("-?")) {
            printUsage();
        } else {
            parse();
            validate();
            if (this.errors.size() > 0) {
                printErrors();
            } else {
                arguments = new Arguments(
                        map == null ? DEFAULT_MAP: map,
                        bot == null ? DEFAULT_BOT: bot,
                        className);
            }
        }
        return arguments;
    }

    public static void printUsage() {
        System.err.println("usage [-m|map MapName] [-b|bot Bot] [-c|className] ClassName");
        System.err.println("\tMapName: a map name (VeryEasy, Easy, Medium, LargeMedium, Hard)");
        System.err.println("\t\tdefault: Easy");
        System.err.println("\tBot: a bot name to play against (Default, Milestone1, Milestone2, Milestone3)");
        System.err.println("\t\tdefault: Milestone1");
        System.err.println("\tClassName: full class name (include package) of your bot");
        System.err.println("\t\tdefault: your file name + .Bot");
    }

    private void parse() {
        if (!arguments.isEmpty()) {
            while (!arguments.isEmpty()) {
                final String argument = arguments.poll();
                if (argument.startsWith("-")) {
                    if (argument.length() == 1) {
                        errors.add(String.format("invalid argument format"));
                    } else {
                        if (argument.equals("-m") || argument.equals("-map")) {
                            map = getArgumentValue(argument);
                        } else if (argument.equals("-b") || argument.equals("-bot")) {
                            bot = getArgumentValue(argument);
                        } else if (argument.equals("-c") || argument.equals("-className")) {
                            className = getArgumentValue(argument);
                        } else {
                            errors.add(String.format("argument %s is unknown", argument));
                        }
                    }
                } else {
                    className = argument;
                }
            }
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
        printUsage();
    }

    private String getArgumentValue(final String argument) {
        final String value;
        if (arguments.isEmpty()) {
            errors.add(String.format("argument %s expects a value", argument));
            value = null;
        } else {
            value = arguments.poll();
        }
        return value;
    }
}