package com.scottlogic.hackathon.server.services;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.scottlogic.hackathon.bots.Milestone1Bot;
import com.scottlogic.hackathon.game.Id;
import com.scottlogic.hackathon.remote.RemoteBot;
import com.scottlogic.hackathon.remote.TeamId;
import com.scottlogic.hackathon.remote.Turn;
import com.scottlogic.hackathon.server.authentication.User;
import com.scottlogic.hackathon.server.models.GameConfiguration;
import com.scottlogic.hackathon.server.models.MilestoneBot;
import com.scottlogic.hackathon.server.models.Team;
import com.scottlogic.hackathon.server.models.TeamBot;
import com.scottlogic.hackathon.server.services.stores.BotStore;

import static com.scottlogic.hackathon.server.models.MilestoneBot.MILESTONE_BOT_PREFIX;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.doReturn;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class BotServiceTest {

  private static final User ADMIN = new User("admin", User.Role.ADMIN);
  private static final Id BOT_ID = new Id(1L);
  private static final Id REMOTE_TEAM_ID = new Id(2L);
  private static final UUID TEAM_ID = UUID.fromString("00000000-0000-0000-0000-000000000000");
  private static final String MILESTONE_NAME = MILESTONE_BOT_PREFIX + "Milestone1Bot";
  private static final String TEAM_NAME = "TheTeam";

  @Mock private BotStore botStore;
  @Mock private TeamService teamService;
  @Mock private GameService gameService;
  @Mock private MilestoneService milestoneService;
  @Mock private HackathonService hackathonService;
  @Mock private RemoteBotStore remoteBotStore;

  private BotService botService;

  @BeforeEach
  void setUp() {
    botService =
        new BotService(
            botStore, teamService, gameService, milestoneService, hackathonService, remoteBotStore);
  }

  @Test
  void createTeamBotMap_canGetTeamBot() {
    var game = new GameConfiguration(Set.of(TEAM_NAME), "not used", "not used");

    var team = createTeam();
    when(teamService.getTeam(TEAM_NAME)).thenReturn(team);

    var teamBot = new TeamBot(team, BOT_ID);
    when(botStore.list()).thenReturn(List.of(teamBot));

    var remoteBot = new RemoteBot(new TeamId(TEAM_NAME, REMOTE_TEAM_ID), new Turn());
    doReturn(Optional.of(remoteBot)).when(remoteBotStore).get(BOT_ID);

    var result = botService.createTeamBotMap(ADMIN, game);

    assertEquals(result, Map.of(team, remoteBot));
  }

  @Test
  void createTeamBotMap_canGetMilestoneBot() {
    var game = new GameConfiguration(Set.of(MILESTONE_NAME), "not used", "not used");

    var milestone = new MilestoneBot(new Milestone1Bot());
    when(milestoneService.getMilestones()).thenReturn(List.of(milestone));

    var result = botService.createTeamBotMap(ADMIN, game);

    var team = Team.createTeam(MILESTONE_NAME);
    assertTrue(result.containsKey(team));
    assertTrue(result.get(team) instanceof Milestone1Bot);
  }

  @Test
  void createTeamBotMap_throwsExceptionWhenTeamHasNoBots() {
    var game = new GameConfiguration(Set.of(TEAM_NAME), "not used", "not used");

    var team = createTeam();
    when(teamService.getTeam(TEAM_NAME)).thenReturn(team);

    var thrown =
        assertThrows(
            IllegalArgumentException.class, () -> botService.createTeamBotMap(ADMIN, game));

    assertEquals(thrown.getMessage(), "Team TheTeam has no bots.");
  }

  @Test
  void createTeamBotMap_throwsExceptionWhenTeamIsNotConnected() {
    var game = new GameConfiguration(Set.of(TEAM_NAME), "not used", "not used");

    var team = createTeam();
    when(teamService.getTeam(TEAM_NAME)).thenReturn(team);

    var teamBot = new TeamBot(team, BOT_ID);
    when(botStore.list()).thenReturn(List.of(teamBot));

    var thrown =
        assertThrows(
            IllegalArgumentException.class, () -> botService.createTeamBotMap(ADMIN, game));

    assertEquals(thrown.getMessage(), "Team TheTeam is not connected to the server.");
  }

  @Test
  void createTeamBotMap_throwsExceptionWhenMilestoneDoesNotExist() {
    var game = new GameConfiguration(Set.of(MILESTONE_NAME), "not used", "not used");

    var thrown =
        assertThrows(
            IllegalArgumentException.class, () -> botService.createTeamBotMap(ADMIN, game));

    assertEquals(
        thrown.getMessage(),
        "com.scottlogic.hackathon.bots.Milestone1Bot is not a valid milestone bot.");
  }

  private static Team createTeam() {
    var team = new Team(TEAM_ID);
    team.setName(TEAM_NAME);
    return team;
  }
}
