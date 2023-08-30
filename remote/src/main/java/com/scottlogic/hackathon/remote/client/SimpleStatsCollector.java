package com.scottlogic.hackathon.remote.client;

import java.time.Duration;
import java.time.Instant;
import java.util.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

// Not threadsafe
public class SimpleStatsCollector {

  private static final Logger logger = LoggerFactory.getLogger(SimpleStatsCollector.class);
  private final Map<String, List<Long>> methodStats = new HashMap<>();

  private Instant start;
  private String method;

  public void recordStart(String method) {
    start = Instant.now();
    this.method = method;
  }

  public void recordEnd() {
    Instant finish = Instant.now();
    long timeElapsed = Duration.between(start, finish).toMillis();
    List<Long> acc = methodStats.getOrDefault(method, new ArrayList<>());
    acc.add(timeElapsed);
    methodStats.put(method, acc);
  }

  public void reset() {
    methodStats.clear();
  }

  public void logStats() {
    StringBuilder sb = new StringBuilder();
    for (Map.Entry<String, List<Long>> entry : methodStats.entrySet()) {
      String method = entry.getKey();
      LongSummaryStatistics stats =
          entry.getValue().stream().mapToLong(Long::longValue).summaryStatistics();
      sb.append(String.format("\nmethod: %s %s ", method, stats.toString()));
    }
    logger.info(sb.toString());
  }
}
