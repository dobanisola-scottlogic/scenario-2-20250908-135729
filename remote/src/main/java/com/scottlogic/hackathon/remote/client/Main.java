package com.scottlogic.hackathon.remote.client;

import org.kohsuke.args4j.CmdLineException;
import org.kohsuke.args4j.CmdLineParser;

public class Main {

  private void doMain(final String[] arguments) {
    ClientArgs clientArgs = new ClientArgs();
    final CmdLineParser parser = new CmdLineParser(clientArgs);
    if (arguments.length < ClientArgs.NUMBER_OF_REQUIRED_ARGS) {
      parser.printUsage(System.out);
      System.exit(-1);
    }
    try {
      parser.parseArgument(arguments);
      clientArgs.run(); // try and load the bot
      ClientRunner runner = new ClientRunner(clientArgs);

      //    new Thread(runner).start();
    } catch (CmdLineException clEx) {
      System.err.println("ERROR: Unable to parse command-line options: " + clEx);
    } catch (RuntimeException rtEx) {
      System.err.println("ERROR: I/O Exception encountered: " + rtEx);
    }
  }

  public static void main(final String[] args) {
    final Main instance = new Main();
    instance.doMain(args);
  }
}
