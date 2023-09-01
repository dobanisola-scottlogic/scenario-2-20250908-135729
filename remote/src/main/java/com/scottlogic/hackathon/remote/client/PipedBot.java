package com.scottlogic.hackathon.remote.client;

import java.io.*;
import java.util.Collections;
import java.util.List;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.scottlogic.hackathon.game.Bot;
import com.scottlogic.hackathon.game.GameState;
import com.scottlogic.hackathon.game.Move;
import com.scottlogic.hackathon.remote.TeamId;
import com.scottlogic.hackathon.remote.serialization.GameStateBroker;
import com.scottlogic.hackathon.remote.serialization.MakeMovesBroker;
import com.scottlogic.hackathon.remote.serialization.TeamIdBroker;

public class PipedBot extends Bot {
  private final BufferedReader br;
  private final PrintWriter out;
  private static final Logger logger = LoggerFactory.getLogger(PipedBot.class);
  private SimpleStatsCollector stats = new SimpleStatsCollector();

  public PipedBot(String displayName, String cmd) throws IOException {
    super(displayName);
    Process p = Runtime.getRuntime().exec(cmd);
    br = new BufferedReader(new InputStreamReader(p.getInputStream()));
    out = new PrintWriter(new OutputStreamWriter(p.getOutputStream()), true);

    Thread errorOutputThread =
        new Thread(errorReporter(new BufferedReader(new InputStreamReader(p.getErrorStream()))));
    errorOutputThread.setDaemon(true);
    errorOutputThread.start();
  }

  public void initialise(GameState initialGameState) {
    // This is the signal that a new game is about to begin
    out.println(TeamIdBroker.serialize(new TeamId(getDisplayName(), getId())));
    out.println(GameStateBroker.serialize(initialGameState));

    stats.logStats();
    stats.reset();
  }

  public List<Move> makeMoves(GameState gameState) {
    List<Move> moves;
    stats.recordStart("makeMoves");
    try {
      out.println(GameStateBroker.serialize(gameState));
      moves = MakeMovesBroker.deserialize(br.readLine());

    } catch (IOException e) {
      e.printStackTrace();
      moves = Collections.emptyList();
    }
    stats.recordEnd();
    return moves;
  }

  Runnable errorReporter(BufferedReader reader) {
    return () -> {
      try {
        for (String line = reader.readLine(); line != null; line = reader.readLine()) {
          logger.info(line);
        }
      } catch (IOException ioe) {
        logger.error("Cannot read error stream " + ioe.getLocalizedMessage());
      }
    };
  }
}
