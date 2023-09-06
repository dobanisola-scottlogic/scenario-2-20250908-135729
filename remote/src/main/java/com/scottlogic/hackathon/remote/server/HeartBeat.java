package com.scottlogic.hackathon.remote.server;

import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.ScheduledFuture;
import java.util.concurrent.TimeUnit;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class HeartBeat {
  private static final long NO_INITIAL_DELAY = 0;
  private static Logger logger = LoggerFactory.getLogger(HeartBeat.class.getName());

  private final ScheduledExecutorService service;
  ScheduledFuture<?> beatHandle;

  private Sender sender;
  private final long period;
  private final TimeUnit periodTimeUnit;
  private boolean isCancelled;

  HeartBeat(Sender sender, long period, TimeUnit periodTimeUnit, ScheduledExecutorService service) {
    this.sender = sender;
    this.period = period;
    this.periodTimeUnit = periodTimeUnit;
    this.service = service;
  }

  Runnable beat() {
    return () -> sender.sendPing();
  }

  public void start() {
    logger.trace("-->scheduled beat");
    beatHandle = service.scheduleAtFixedRate(beat(), NO_INITIAL_DELAY, period, periodTimeUnit);
  }

  public void shutdown() {
    logger.trace("-->calling shutdown");
    if (!isCancelled) {
      Runnable canceller = () -> beatHandle.cancel(true);
      logger.trace("scheduled canceller");
      service.schedule(canceller, 0, TimeUnit.MILLISECONDS);
      service.shutdown();
      isCancelled = true;
    }
  }
}
