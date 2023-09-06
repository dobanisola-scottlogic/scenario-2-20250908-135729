package com.scottlogic.hackathon.remote.client;

import org.hamcrest.core.Is;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.kohsuke.args4j.CmdLineException;
import org.kohsuke.args4j.CmdLineParser;
import org.mockito.Mock;
import org.powermock.core.classloader.annotations.PrepareForTest;
import org.powermock.modules.junit4.PowerMockRunner;

import static java.util.Arrays.asList;
import static org.hamcrest.core.Is.is;
import static org.junit.Assert.*;
import static org.powermock.api.mockito.PowerMockito.whenNew;

@RunWith(PowerMockRunner.class)
@PrepareForTest({PipedBot.class, ClientArgs.class})
public class PythonClientArgsTest {
  private static final String TEAM = "team";
  private static final String HOST = "host";
  private static final String PORT = "8080";

  private static final String COMMAND = "command";

  @Mock PipedBot pipedBot;

  @Test
  public void testParsePythonClientArgs() {
    ClientArgs clientArgs = new ClientArgs();
    final CmdLineParser parser = new CmdLineParser(clientArgs);

    String[] args =
        asList("--command", COMMAND, "--team", TEAM, "--host", HOST, "--port", PORT)
            .toArray(new String[] {});
    try {
      parser.parseArgument(args);
    } catch (CmdLineException e) {
      assertNull(e);
    }

    assertNull(clientArgs.getBotClassPath());
    assertThat(clientArgs.getHost(), Is.is(HOST));
    assertThat(clientArgs.getTeam(), Is.is(TEAM));
    assertThat(clientArgs.getPort(), Is.is(Integer.valueOf(PORT)));
    assertThat(clientArgs.getCommand(), is(COMMAND));
  }

  @Test
  public void testInitPythonClientArgs() throws Exception {
    whenNew(PipedBot.class).withAnyArguments().thenReturn(pipedBot);

    ClientArgs clientArgs = new ClientArgs();
    final CmdLineParser parser = new CmdLineParser(clientArgs);

    String[] args =
        asList("--command", COMMAND, "--team", TEAM, "--host", HOST, "--port", PORT)
            .toArray(new String[] {});
    try {
      parser.parseArgument(args);
    } catch (CmdLineException e) {
      assertNull(e);
    }

    clientArgs.init();

    assertNull(clientArgs.getBotClassPath());
    assertNotNull(clientArgs.getBot());
  }
}
