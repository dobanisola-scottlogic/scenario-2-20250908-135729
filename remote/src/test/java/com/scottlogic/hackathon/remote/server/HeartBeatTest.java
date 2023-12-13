package com.scottlogic.hackathon.remote.server;

import java.util.concurrent.*;
import org.awaitility.Awaitility;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Mock;
import org.mockito.junit.MockitoJUnitRunner;
import org.mockito.stubbing.Answer;

import static junit.framework.TestCase.assertTrue;
import static org.awaitility.Awaitility.await;
import static org.mockito.Mockito.*;
import static org.mockito.internal.verification.VerificationModeFactory.atLeast;

@RunWith(MockitoJUnitRunner.class)
public class HeartBeatTest {

  @Mock Sender sender;

  @Test(timeout = 1000)
  public void testStart() {
    HeartBeat hb =
        new HeartBeat(
            sender, 5, TimeUnit.MILLISECONDS, Executors.newSingleThreadScheduledExecutor());

    final int[] counter = new int[1];

    doAnswer((Answer<Integer>) invocation -> ++counter[0]).when(sender).sendPing();

    hb.start();

    Awaitility.setDefaultPollDelay(0, TimeUnit.MILLISECONDS);
    Awaitility.setDefaultPollInterval(10, TimeUnit.MILLISECONDS);
    await().atMost(250, TimeUnit.MILLISECONDS).until(() -> counter[0] > 5);

    verify(sender, atLeast(5)).sendPing();
    hb.shutdown();
  }

  @Test(timeout = 1000)
  public void testShutdown() {
    ScheduledExecutorService service = Executors.newSingleThreadScheduledExecutor();
    HeartBeat hb = new HeartBeat(sender, 10, TimeUnit.MILLISECONDS, service);

    hb.start();
    await().atLeast(5, TimeUnit.MILLISECONDS);
    hb.shutdown();
    await().atLeast(5, TimeUnit.MILLISECONDS);

    assertTrue(service.isShutdown());
  }
}
