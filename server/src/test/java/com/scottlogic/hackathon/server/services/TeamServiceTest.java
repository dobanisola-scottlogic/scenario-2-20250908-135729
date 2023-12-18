package com.scottlogic.hackathon.server.services;

import java.util.Collections;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.MockedStatic;
import org.mockito.junit.jupiter.MockitoExtension;
import software.amazon.awssdk.services.cloud9.Cloud9Client;
import software.amazon.awssdk.services.cloud9.Cloud9ClientBuilder;
import software.amazon.awssdk.services.cloud9.model.DescribeEnvironmentsRequest;
import software.amazon.awssdk.services.cloud9.model.DescribeEnvironmentsResponse;
import software.amazon.awssdk.services.cloud9.model.Environment;
import software.amazon.awssdk.services.cloud9.model.ListEnvironmentsResponse;

import com.scottlogic.hackathon.server.models.TeamInfo;
import com.scottlogic.hackathon.server.services.stores.TeamStore;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.mockStatic;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class TeamServiceTest {
  @Mock TeamStore teamStore;
  @Mock Cloud9Client cloud9;
  @Mock ListEnvironmentsResponse listResponse;
  @Mock DescribeEnvironmentsResponse describeResponse;
  @Mock Environment environment;
  @Mock TeamInfo teamInfo;
  @Mock Cloud9ClientBuilder cloud9ClientBuilder;
  MockedStatic<Cloud9Client> cloud9Client;
  MockedStatic<TeamInfo> teamInfoStatic;

  @BeforeEach
  public void init() {
    cloud9 = mock(Cloud9Client.class);
    teamStore = mock(TeamStore.class);
    listResponse = mock(ListEnvironmentsResponse.class);
    environment = mock(Environment.class);
    teamInfo = mock(TeamInfo.class);

    cloud9Client = mockStatic(Cloud9Client.class);
    cloud9ClientBuilder = mock(Cloud9ClientBuilder.class);
    cloud9Client.when(Cloud9Client::builder).thenReturn(cloud9ClientBuilder);
    when(cloud9ClientBuilder.build()).thenReturn(cloud9);

    when(environment.name()).thenReturn("test-workspace-42");

    when(listResponse.environmentIds()).thenReturn(Collections.singletonList("environment-id"));
    when(cloud9.listEnvironments()).thenReturn(listResponse);
    when(cloud9.describeEnvironments(any(DescribeEnvironmentsRequest.class))).thenReturn(describeResponse);
    when(describeResponse.environments()).thenReturn(Collections.singletonList(environment));

    teamInfoStatic = mockStatic(TeamInfo.class);
    teamInfo.accountId = "account-id";
    teamInfo.userName = "resource-id";
    teamInfo.devEnvironment = "https://region.console.aws.amazon.com/cloud9/ide/environment-id";
    teamInfo.password = "test-password";
    teamInfoStatic.when(() -> TeamInfo.fromEnvironment(environment)).thenReturn(teamInfo);
  }

  @AfterEach
  public void close() {
    cloud9Client.close();
    teamInfoStatic.close();
  }

  @Test
  public void getTeamInfoTest() {
    TeamService teamService = new TeamService(teamStore);
    TeamInfo teamInfo = teamService.getTeamInfo("test42");

    assertEquals(teamInfo.accountId, "account-id");
    assertEquals(teamInfo.userName, "resource-id");
    assertEquals(teamInfo.password, System.getenv("CONTESTANT_PASSWORD"));
    assertEquals(teamInfo.devEnvironment, "https://region.console.aws.amazon.com/cloud9/ide/environment-id");
  } 

  @Test
  public void getTeamInfoNotFoundTest() {
    TeamService teamService = new TeamService(teamStore);
    TeamInfo teamInfo = teamService.getTeamInfo("test99");

    assertEquals(teamInfo, null);
  } 

}
