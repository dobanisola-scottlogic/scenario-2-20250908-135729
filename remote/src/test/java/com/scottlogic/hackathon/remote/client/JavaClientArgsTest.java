package com.scottlogic.hackathon.remote.client;

import java.nio.file.Path;
import java.nio.file.Paths;
import org.junit.Ignore;
import org.junit.Test;
import org.kohsuke.args4j.CmdLineException;
import org.kohsuke.args4j.CmdLineParser;

import static java.util.Arrays.asList;
import static org.hamcrest.core.Is.is;
import static org.junit.Assert.*;

public class JavaClientArgsTest {

  static Path resourcesDirectory = Paths.get("src", "test", "resources");
  private static final String BOT_CLASSPATH = resourcesDirectory.toFile().getAbsolutePath();
  private static final String BOT = "com.contestantbots.team.ExampleBot2";
  private static final String TEAM = "team";
  private static final String HOST = "host";
  private static final String PORT = "8080";

  @Test
  public void testParseJavaClientArgs() {
    ClientArgs clientArgs = new ClientArgs();
    final CmdLineParser parser = new CmdLineParser(clientArgs);

    String[] args =
        asList(
                "--botclasspath",
                BOT_CLASSPATH,
                "--bot",
                BOT,
                "--team",
                TEAM,
                "--host",
                HOST,
                "--port",
                PORT)
            .toArray(new String[] {});
    try {
      parser.parseArgument(args);
    } catch (CmdLineException e) {
      assertNull(e);
    }

    assertThat(clientArgs.getBotClassPath().getAbsolutePath(), is(BOT_CLASSPATH));
    assertThat(clientArgs.getBotClazz(), is(BOT));
    assertThat(clientArgs.getHost(), is(HOST));
    assertThat(clientArgs.getTeam(), is(TEAM));
    assertThat(clientArgs.getPort(), is(Integer.valueOf(PORT)));
  }

  @Test
  @Ignore
  public void testInitJavaClientArgs() {
    ClientArgs clientArgs = new ClientArgs();
    final CmdLineParser parser = new CmdLineParser(clientArgs);

    String[] args =
        asList(
                "--botclasspath",
                BOT_CLASSPATH,
                "--bot",
                BOT,
                "--team",
                TEAM,
                "--host",
                HOST,
                "--port",
                PORT)
            .toArray(new String[] {});
    try {
      parser.parseArgument(args);
    } catch (CmdLineException e) {
      assertNull(e);
    }

    clientArgs.init();

    assertNotNull(clientArgs.getBot());
    assertNotNull(clientArgs.getBotSocketUri());
  }
}
