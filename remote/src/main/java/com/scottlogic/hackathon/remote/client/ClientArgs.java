package com.scottlogic.hackathon.remote.client;

import java.io.File;
import java.io.IOException;
import java.net.URI;
import java.net.URISyntaxException;
import java.net.URL;
import java.net.URLClassLoader;
import lombok.Getter;
import org.kohsuke.args4j.Option;

import com.scottlogic.hackathon.game.Bot;

import static java.lang.String.format;

/**
 * java -jar /c/dev/hackathon/contestant3/libs/remote-1.0-SNAPSHOT-all.jar -v -b (--bot) VAL : Fully
 * qualified bot class. -bcp (--botclasspath) FILE : Fully qualified path to bot classes. -h
 * (--host) VAL : The ip of the host machine that will run your bot -p (--port) N : The listening
 * port of the host machine that will run your bot -t (--team) VAL : contestant team name -v
 * (--verbose) : Print verbose status. (default: false)
 *
 * <p>example:
 *
 * <p>java -jar /c/dev/hackathon/contestant3/libs/remote-1.0-SNAPSHOT-all.jar --botclasspath
 * /c/dev/hackathon/contestant3/build/classes/java/main --bot com.contestantbots.team.ExampleBot
 * --team a --host localhost --port 8080
 */
public class ClientArgs {

  public static final int NUMBER_OF_REQUIRED_ARGS = 6;

  @Option(name = "-v", aliases = "--verbose", usage = "Print verbose status.")
  private boolean verbose;

  @Getter private File botClassPath;

  @Getter
  @Option(
      name = "-b",
      aliases = "--bot",
      usage = "Fully qualified bot class.",
      depends = {"--botclasspath"},
      forbids = {"--command"})
  private String botClazz = "com.contestantbots.team.ExampleBot";

  @Getter
  @Option(
      name = "-c",
      aliases = "--command",
      usage = "Command string to an external program that will respond to stdio",
      forbids = {"--bot", "--botclasspath"})
  private String command;

  @Getter
  @Option(name = "-t", aliases = "--team", usage = "contestant team name", required = true)
  private String team;

  @Getter
  @Option(
      name = "-h",
      aliases = "--host",
      usage = "The ip of the host machine that will run your bot",
      required = true)
  private String host;

  @Getter
  @Option(
      name = "-p",
      aliases = "--port",
      usage = "The listening port of the host machine that will run your bot",
      required = true)
  private int port;

  @Getter private Bot bot;
  @Getter private URI botSocketUri;

  @Option(
      name = "-bcp",
      aliases = "--botclasspath",
      usage = "Fully qualified path to bot classes.",
      depends = {"--bot"},
      forbids = {"--command"})
  public void setBotClassPath(File file) {
    if (file.isDirectory()) {
      botClassPath = file;
    } else {
      throw new RuntimeException(
          format(
              "The botclasspath value '%s' is not a directory on the file system!",
              file.getAbsolutePath()));
    }
  }

  public void init() {
    if (command != null) {
      try {
        this.bot = new PipedBot(team, command);
      } catch (IOException ioe) {
        throw new RuntimeException("Failed to initialise PipedBot using command " + command, ioe);
      }

    } else {
      try {
        URL[] cp = {botClassPath.toURI().toURL()};
        URLClassLoader urlcl = new URLClassLoader(cp);
        Class<Bot> clazz = (Class<Bot>) urlcl.loadClass(botClazz);
        this.bot = clazz.getDeclaredConstructor(String.class).newInstance(team);
      } catch (Exception ex) {
        throw new RuntimeException(
            "Failed to load Bot class " + botClazz + " from " + botClassPath.getAbsolutePath());
      }
    }

    try {
      this.botSocketUri = new URI(format("ws://%s:%s/%s", host, port, "application/connect"));
    } catch (URISyntaxException e) {
      throw new RuntimeException(
          format("Failed to form a valid websocket URI using host: %s and port %d", host, port));
    }
  }

  public String toString() {
    StringBuffer buffer = new StringBuffer();
    buffer.append("Remote Client");
    buffer.append(" team='");
    buffer.append(team);
    buffer.append("'  host='");
    buffer.append(host);
    buffer.append("'  port='");
    buffer.append(port);
    if (botClassPath != null) {
      buffer.append("'  botclasspath='");
      buffer.append(
          (botClassPath != null) && botClassPath.isDirectory()
              ? botClassPath.getAbsoluteFile()
              : "invalid!");
      buffer.append("'  bot='");
      buffer.append(botClazz);
      buffer.append("'");
    } else {
      buffer.append("'  command='");
      buffer.append(command);
    }

    return buffer.toString();
  }

  public void run() {
    System.out.println(this);
    init();
  }
}
