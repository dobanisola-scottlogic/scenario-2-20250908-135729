package com.scottlogic.hackathon.server.models;

import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Mock;
import org.mockito.junit.MockitoJUnitRunner;
import software.amazon.awssdk.services.cloud9.model.Environment;

import static org.junit.Assert.assertEquals;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

@RunWith(MockitoJUnitRunner.class)
public class TeamInfoTest {
  @Mock Environment environment;

  @Before
  public void init() {
    environment = mock(Environment.class);
    when(environment.arn()).thenReturn("arn:partition:service:region:account-id:resource-type:resource-id");
    when(environment.ownerArn()).thenReturn("arn:partition:service:region:account-id:resource-type/resource-id");
    when(environment.id()).thenReturn("environment-id");
  }

  @Test
  public void createFromEnvironmentTest() {

    TeamInfo teamInfo = TeamInfo.fromEnvironment(environment);

    assertEquals(teamInfo.accountId, "account-id");
    assertEquals(teamInfo.userName, "resource-id");
    assertEquals(teamInfo.password, System.getenv("CONTESTANT_PASSWORD"));
    assertEquals(teamInfo.devEnvironment, "https://region.console.aws.amazon.com/cloud9/ide/environment-id");
  }
}
