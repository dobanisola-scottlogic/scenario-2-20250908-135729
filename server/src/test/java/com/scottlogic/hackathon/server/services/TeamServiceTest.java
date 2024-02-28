package com.scottlogic.hackathon.server.services;

import java.util.Collections;
import java.util.UUID;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.NullAndEmptySource;
import org.junit.jupiter.params.provider.NullSource;
import org.junit.jupiter.params.provider.ValueSource;
import org.mockito.Mock;
import org.mockito.MockedStatic;
import org.mockito.junit.jupiter.MockitoExtension;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.cloud9.Cloud9Client;
import software.amazon.awssdk.services.cloud9.Cloud9ClientBuilder;
import software.amazon.awssdk.services.cloud9.model.DescribeEnvironmentsRequest;
import software.amazon.awssdk.services.cloud9.model.DescribeEnvironmentsResponse;
import software.amazon.awssdk.services.cloud9.model.Environment;
import software.amazon.awssdk.services.cloud9.model.ListEnvironmentsResponse;

import com.scottlogic.hackathon.server.models.Hackathon;
import com.scottlogic.hackathon.server.models.Team;
import com.scottlogic.hackathon.server.models.TeamInfo;
import com.scottlogic.hackathon.server.services.stores.TeamStore;
import com.scottlogic.hackathon.server.services.stores.TeamUpdate;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyBoolean;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.mockStatic;
import static org.mockito.Mockito.spy;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class TeamServiceTest {

  @Mock
  TeamStore teamStore;
  @Mock
  Cloud9Client cloud9;
  @Mock
  ListEnvironmentsResponse listResponse;
  @Mock
  DescribeEnvironmentsResponse describeResponse;
  @Mock
  Environment environment;
  @Mock
  TeamInfo teamInfo;
  @Mock
  Cloud9ClientBuilder cloud9ClientBuilder;
  @Mock
  HackathonService hackathonService;
  MockedStatic<Cloud9Client> cloud9Client;
  MockedStatic<TeamInfo> teamInfoStatic;
  MockedStatic<Region> regionStatic;
  TeamService teamService;

  @BeforeEach
  public void init() {
    cloud9 = mock(Cloud9Client.class);
    teamStore = mock(TeamStore.class);
    listResponse = mock(ListEnvironmentsResponse.class);
    environment = mock(Environment.class);
    teamInfo = mock(TeamInfo.class);
    hackathonService = mock(HackathonService.class);

    cloud9Client = mockStatic(Cloud9Client.class);
    cloud9ClientBuilder = mock(Cloud9ClientBuilder.class);
    cloud9Client.when(Cloud9Client::builder).thenReturn(cloud9ClientBuilder);
    when(cloud9ClientBuilder.build()).thenReturn(cloud9);
    when(cloud9ClientBuilder.region(any())).thenReturn(cloud9ClientBuilder);
    when(cloud9ClientBuilder.credentialsProvider(any())).thenReturn(cloud9ClientBuilder);

    regionStatic = mockStatic(Region.class);
    regionStatic.when(() -> Region.of(any())).thenReturn(Region.EU_WEST_2);

    teamInfoStatic = mockStatic(TeamInfo.class);
    teamInfo.accountId = "account-id";
    teamInfo.userName = "resource-id";
    teamInfo.devEnvironment = "https://region.console.aws.amazon.com/cloud9/ide/environment-id";
    teamInfo.password = "test-password";
    teamInfoStatic.when(() -> TeamInfo.fromEnvironment(environment)).thenReturn(teamInfo);

    teamService = new TeamService(teamStore, hackathonService);
  }

  @AfterEach
  public void close() {
    cloud9Client.close();
    teamInfoStatic.close();
    regionStatic.close();
  }

  @Test
  void addTeamTest() {
    var team = new Team();
    team.setName("name");
    team.setPassword("password");
    team.setHackathonId("testHackathon");
    when(teamStore.save(team)).thenReturn(team);
    when(hackathonService.getHackathon(anyString())).thenReturn(mock());

    var result = teamService.addTeam(team);

    assertEquals(result, team);
  }

  @Test
  void addTeam_exceptionOnDuplicateName() {
    var team = new Team();
    team.setName("name");
    team.setPassword("password");
    when(teamStore.get(anyString(), anyString(), anyBoolean())).thenReturn(team);

    var thrown = assertThrows(IllegalArgumentException.class, () -> teamService.addTeam(team));

    assertEquals("Team name already exists", thrown.getMessage());
  }

  @Test
  void addTeam_exceptionOnDuplicateNameWithSpaces() {
    var request = new Team();
    request.setName(" name ");
    request.setPassword("password");

    var team = new Team();
    team.setName("name");
    when(teamStore.get(anyString(), anyString(), anyBoolean())).thenReturn(team);

    var thrown = assertThrows(IllegalArgumentException.class, () -> teamService.addTeam(request));

    assertEquals("Team name already exists", thrown.getMessage());
  }

  @ParameterizedTest
  @ValueSource(strings = { "", "    " })
  void addTeam_exceptionOnEmptyName(String name) {
    var team = new Team();
    team.setName(name);
    team.setPassword("password");

    var thrown = assertThrows(IllegalArgumentException.class, () -> teamService.addTeam(team));

    assertEquals("Team name cannot be blank", thrown.getMessage());
  }

  @Test
  void addTeam_exceptionOnEmptyPassword() {
    var team = new Team();
    team.setName("name");
    team.setPassword("");

    var thrown = assertThrows(IllegalArgumentException.class, () -> teamService.addTeam(team));

    assertEquals("Team password cannot be empty", thrown.getMessage());
  }

  @ParameterizedTest
  @ValueSource(booleans ={true, false} )
  void updateTeam_whenNewName_andNoTeamFoundWithSpecifiedName(boolean isExistingTeamWithName) {
    final String teamId = "550e8400-e29b-41d4-a716-446655440000";

    var team = new Team();
    team.setName("Team1");
    team.setPassword("P@$$w0rd123");

    // Ensure the id of the entity we return from the mock store
    // will be a different instance than the one we receive from the caller:
    team.setId(UUID.fromString(teamId));

    when(teamStore.get(anyString(), anyString(), anyBoolean())).thenReturn(isExistingTeamWithName ? team : null);
    when(teamStore.update(any(), any())).thenReturn(team);

    TeamUpdate teamUpdate = new TeamUpdate();
    teamUpdate.setName("Team99");
    teamUpdate.setPassword("Password");

    // Ensure the id is a different instance than the one we return from the mock store:
    var result = teamService.updateTeam(UUID.fromString(teamId), teamUpdate);

    assertEquals(team, result);
  }

  @ParameterizedTest
  @NullAndEmptySource
  void updateTeam_newTeamName(String emptyPassword) {
    var team = new Team();
    team.setName("renamed");
    team.setPassword("password");
    when(teamStore.get(anyString(), anyString(), anyBoolean())).thenReturn(null);
    when(teamStore.update(any(), any())).thenReturn(team);

    TeamUpdate teamUpdate = new TeamUpdate();
    teamUpdate.setName("renamed");
    teamUpdate.setPassword(emptyPassword);
    var result = teamService.updateTeam(team.getId(), teamUpdate);

    assertEquals(team, result);
  }

  @ParameterizedTest
  @NullSource
  @ValueSource(strings = { "", "    " })
  void updateTeam_newPassword(String emptyName) {
    var team = new Team();
    team.setName("name");
    team.setPassword("secret");

    when(teamStore.update(any(), any())).thenReturn(team);

    TeamUpdate teamUpdate = new TeamUpdate();
    teamUpdate.setName(emptyName);
    teamUpdate.setPassword("secret");
    var result = teamService.updateTeam(team.getId(), teamUpdate);

    assertEquals(team, result);
  }

  @Test
  void updateTeam_newTeamNameAndPassword() {
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

  @ParameterizedTest
  @ValueSource(strings = { "", "    " })
  void updateTeam_exceptionOnEmptyNameAndPassword(String name) {
    var team = new Team();

    TeamUpdate teamUpdate = new TeamUpdate();
    teamUpdate.setName(name);
    UUID teamId = team.getId();
    var thrown = assertThrows(IllegalArgumentException.class, () -> teamService.updateTeam(teamId, teamUpdate));

    assertEquals("Nothing to change", thrown.getMessage());
  }

  @Test
  void updateTeam_exceptionOnDuplicateTeamName() {
    var team = new Team();
    team.setId(UUID.randomUUID());

    var otherTeam = new Team();
    otherTeam.setId(UUID.randomUUID());
    otherTeam.setName("name");

    when(teamStore.get(anyString(), anyString(), anyBoolean())).thenReturn(otherTeam);

    TeamUpdate teamUpdate = new TeamUpdate();
    teamUpdate.setName("name");
    UUID teamId = team.getId();
    var thrown = assertThrows(IllegalArgumentException.class, () -> teamService.updateTeam(teamId, teamUpdate));

    assertEquals("Team name already exists", thrown.getMessage());
  }

  @Test
  void getTeamInfoTest() {
    TeamService teamServiceSpy = initGetTeamInfo(teamService);
    TeamInfo teamInfo = teamServiceSpy.getTeamInfo("test42");

    assertEquals("account-id", teamInfo.accountId);
    assertEquals("resource-id", teamInfo.userName);
    assertEquals("test-password", teamInfo.password);
    assertEquals("https://region.console.aws.amazon.com/cloud9/ide/environment-id", teamInfo.devEnvironment);
  }

  @Test
  void getTeamInfoNotFoundTest() {
    TeamService teamServiceSpy = initGetTeamInfo(teamService);
    TeamInfo teamInfo = teamServiceSpy.getTeamInfo("test99");

    assertEquals(null, teamInfo);
  }

  private TeamService initGetTeamInfo(TeamService teamService) {
    TeamService teamServiceSpy = spy(teamService);
    when(teamServiceSpy.getWorkspace()).thenReturn("test-workspace");
    when(environment.name()).thenReturn("test-workspace-42");
    when(listResponse.environmentIds()).thenReturn(Collections.singletonList("environment-id"));
    when(cloud9.listEnvironments()).thenReturn(listResponse);
    when(cloud9.describeEnvironments(any(DescribeEnvironmentsRequest.class))).thenReturn(describeResponse);
    when(describeResponse.environments()).thenReturn(Collections.singletonList(environment));
    return teamServiceSpy;
  }

  @Test
  void createTeamExistingHackathonTest() {
    Team testTeam = Team.createTeam("testTeam");
    testTeam.setPassword("password");
    when(teamStore.save(testTeam)).thenReturn(testTeam);
    when(hackathonService.getHackathon(anyString())).thenReturn(mock(Hackathon.class));
    testTeam.setHackathonId("existingHackathon");

    TeamService teamService = new TeamService(teamStore, hackathonService);
    Team returnedTeam = teamService.addTeam(testTeam);

    verify(teamStore).save(testTeam);
    assertEquals(testTeam, returnedTeam);
  }

  @Test
  void createTeamWithNonExistentHackathonTest() {
    when(hackathonService.getHackathon(anyString())).thenReturn(null);
    Team testTeam = Team.createTeam("testTeam");
    testTeam.setPassword("password");
    testTeam.setHackathonId("missingHackathon");

    TeamService teamService = new TeamService(teamStore, hackathonService);

    IllegalArgumentException thrown = assertThrows(
        IllegalArgumentException.class,
        () -> teamService.addTeam(testTeam),
        "Expected attempting to add a team with a missing hackathon to raise an IllegalArgumentException");

    assertTrue(thrown.getMessage().contains("Hackathon with ID 'missingHackathon' not found"));
  }
}
