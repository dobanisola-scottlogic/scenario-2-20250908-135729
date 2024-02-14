package com.scottlogic.hackathon.server.services;

import java.util.Collections;
import java.util.UUID;
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

import com.scottlogic.hackathon.server.models.Team;
import com.scottlogic.hackathon.server.models.TeamInfo;
import com.scottlogic.hackathon.server.services.stores.TeamStore;
import com.scottlogic.hackathon.server.services.stores.TeamUpdate;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyBoolean;
import static org.mockito.ArgumentMatchers.anyString;
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
  TeamService teamService;

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

    teamInfoStatic = mockStatic(TeamInfo.class);
    teamInfo.accountId = "account-id";
    teamInfo.userName = "resource-id";
    teamInfo.devEnvironment = "https://region.console.aws.amazon.com/cloud9/ide/environment-id";
    teamInfo.password = "test-password";
    teamInfoStatic.when(() -> TeamInfo.fromEnvironment(environment)).thenReturn(teamInfo);

    teamService = new TeamService(teamStore);
  }

  @AfterEach
  public void close() {
    cloud9Client.close();
    teamInfoStatic.close();
  }

  @Test
  public void addTeamTest() {
    var team = new Team();
    team.setName("name");
    team.setPassword("password");
    when(teamStore.save(team)).thenReturn(team);

    var result = teamService.addTeam(team);

    assertEquals(result, team);
  }

  @Test
  public void addTeam_exceptionOnDuplicateName() {
    var team = new Team();
    team.setName("name");
    team.setPassword("password");
    when(teamStore.get(anyString(), anyString(), anyBoolean())).thenReturn(team);

    var thrown = assertThrows(IllegalArgumentException.class, () -> teamService.addTeam(team));

    assertEquals("Team name already exists", thrown.getMessage());
  }

  @Test
  public void addTeam_exceptionOnDuplicateNameWithSpaces() {
    var request = new Team();
    request.setName(" name ");
    request.setPassword("password");

    var team = new Team();
    team.setName("name");
    when(teamStore.get(anyString(), anyString(), anyBoolean())).thenReturn(team);

    var thrown = assertThrows(IllegalArgumentException.class, () -> teamService.addTeam(request));

    assertEquals("Team name already exists", thrown.getMessage());
  }

  @Test
  public void addTeam_exceptionOnEmptyName() {
    var team = new Team();
    team.setName("");
    team.setPassword("password");

    var thrown = assertThrows(IllegalArgumentException.class, () -> teamService.addTeam(team));

    assertEquals("Team name cannot be empty", thrown.getMessage());
  }

  @Test
  public void addTeam_exceptionOnEmptyNameWithSpaces() {
    var team = new Team();
    team.setName("   ");

    var thrown = assertThrows(IllegalArgumentException.class, () -> teamService.addTeam(team));

    assertEquals("Team name cannot be empty", thrown.getMessage());
  }

  @Test
  public void addTeam_exceptionOnEmptyPassword() {
    var team = new Team();
    team.setName("name");
    team.setPassword("");

    var thrown = assertThrows(IllegalArgumentException.class, () -> teamService.addTeam(team));

    assertEquals("Team password cannot be empty", thrown.getMessage());
  }

  @Test
  public void addTeam_exceptionOnEmptyPasswordWithSpaces() {
    var team = new Team();
    team.setName("name");
    team.setPassword("    ");

    var thrown = assertThrows(IllegalArgumentException.class, () -> teamService.addTeam(team));

    assertEquals("Team password cannot be empty", thrown.getMessage());
  }

  @Test
  public void updateTeam_newTeamName() {
    var team = new Team();
    team.setName("renamed");
    team.setPassword("password");
    when(teamStore.get(anyString(), anyString(), anyBoolean())).thenReturn(null);
    when(teamStore.update(any(), any())).thenReturn(team);

    TeamUpdate teamUpdate = new TeamUpdate();
    teamUpdate.setName("renamed");
    var result = teamService.updateTeam(team.getId(), teamUpdate);

    assertEquals(team, result);
  }

  @Test
  public void updateTeam_newPassword() {
    var team = new Team();
    team.setName("name");
    team.setPassword("secret");

    when(teamStore.update(any(), any())).thenReturn(team);

    TeamUpdate teamUpdate = new TeamUpdate();
    teamUpdate.setPassword("secret");
    var result = teamService.updateTeam(team.getId(), teamUpdate);

    assertEquals(team, result);
  }

  @Test void updateTeam_newTeamNameAndPassword() {
    var team = new Team();
    team.setName("renamed");
    team.setPassword("secret");
    when(teamStore.get(anyString(), anyString(), anyBoolean())).thenReturn(null);
    when(teamStore.update(any(), any())).thenReturn(team);

    TeamUpdate teamUpdate = new TeamUpdate();
    teamUpdate.setName("renamed");
    teamUpdate.setPassword("secret");
    var result = teamService.updateTeam(team.getId(), teamUpdate);

    assertEquals(team, result);
  }

  @Test void updateTeam_exceptionOnEmptyNameAndPassword() {
    var team = new Team();

    TeamUpdate teamUpdate = new TeamUpdate();
    var thrown = assertThrows(IllegalArgumentException.class, () -> teamService.updateTeam(team.getId(), teamUpdate));

    assertEquals("Nothing to change", thrown.getMessage());
  }
  
  @Test void updateTeam_exceptionOnDuplicateTeamName() {
    var team = new Team();
    team.setId(UUID.randomUUID());

    var otherTeam = new Team();
    otherTeam.setId(UUID.randomUUID());
    otherTeam.setName("name");

    when(teamStore.get(anyString(), anyString(), anyBoolean())).thenReturn(otherTeam);

    TeamUpdate teamUpdate = new TeamUpdate();
    teamUpdate.setName("name");
    var thrown = assertThrows(IllegalArgumentException.class, () -> teamService.updateTeam(team.getId(), teamUpdate));

    assertEquals("Team name already exists", thrown.getMessage());
  }

  @Test
  public void getTeamInfoTest() {
    initGetTeamInfo();
    TeamInfo teamInfo = teamService.getTeamInfo("test42");

    assertEquals("account-id", teamInfo.accountId);
    assertEquals("resource-id", teamInfo.userName);
    assertEquals(System.getenv("CONTESTANT_PASSWORD"), teamInfo.password);
    assertEquals("https://region.console.aws.amazon.com/cloud9/ide/environment-id", teamInfo.devEnvironment);
  }

  @Test
  public void getTeamInfoNotFoundTest() {
    initGetTeamInfo();
    TeamInfo teamInfo = teamService.getTeamInfo("test99");

    assertEquals(null, teamInfo);
  }

  private void initGetTeamInfo() {
    when(environment.name()).thenReturn("test-workspace-42");
    when(listResponse.environmentIds()).thenReturn(Collections.singletonList("environment-id"));
    when(cloud9.listEnvironments()).thenReturn(listResponse);
    when(cloud9.describeEnvironments(any(DescribeEnvironmentsRequest.class))).thenReturn(describeResponse);
    when(describeResponse.environments()).thenReturn(Collections.singletonList(environment));
  }
}
