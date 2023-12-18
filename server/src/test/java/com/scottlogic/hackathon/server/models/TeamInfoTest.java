package com.scottlogic.hackathon.server.models;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import software.amazon.awssdk.services.cloud9.model.Environment;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class TeamInfoTest {
  @Mock Environment environment;

  @BeforeEach
  public void init() {
    environment = mock(Environment.class);
    when(environment.arn())
        .thenReturn("arn:partition:service:region:account-id:resource-type:resource-id");
    when(environment.ownerArn())
        .thenReturn("arn:partition:service:region:account-id:resource-type/resource-id");
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
