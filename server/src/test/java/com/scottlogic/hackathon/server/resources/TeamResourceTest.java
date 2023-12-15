package com.scottlogic.hackathon.server.resources;

import javax.ws.rs.core.Response;
import javax.ws.rs.core.SecurityContext;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Mock;
import org.mockito.junit.MockitoJUnitRunner;

import com.scottlogic.hackathon.server.HackathonConfiguration;
import com.scottlogic.hackathon.server.authentication.User;
import com.scottlogic.hackathon.server.models.TeamInfo;
import com.scottlogic.hackathon.server.services.TeamService;

import static org.junit.Assert.assertEquals;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;


@RunWith(MockitoJUnitRunner.class)
public class TeamResourceTest {
  @Mock TeamInfo teamInfo;
  @Mock TeamService teamService;
  @Mock SecurityContext securityContext;
  @Mock User user;
  @Mock HackathonConfiguration hackathonConfiguration;

  @Before
  public void init() {
    teamInfo = mock(TeamInfo.class);
    teamService = mock(TeamService.class);
    securityContext = mock(SecurityContext.class);
    user = mock(User.class);
    hackathonConfiguration = mock(HackathonConfiguration.class);

    when(securityContext.getUserPrincipal()).thenReturn(user);
  }
 
  @Test
  public void getTeamInfoTest() {
    when(user.getName()).thenReturn("test42");

    when(teamService.getTeamInfo(anyString())).thenReturn(teamInfo);
    TeamResource teamResource = new TeamResource(hackathonConfiguration, teamService);
    Response response = teamResource.getTeamInfo(securityContext);

    assertEquals(response.getStatus(), 200);
    assertEquals(response.getEntity(), teamInfo);
  }

  @Test
  public void getTeamInfoNotFoundTest() {
    when(user.getName()).thenReturn("test99");
    when(teamService.getTeamInfo(anyString())).thenReturn(null);

    TeamResource teamResource = new TeamResource(hackathonConfiguration, teamService);
    Response response = teamResource.getTeamInfo(securityContext);

    assertEquals(response.getStatus(), 404);
    assertEquals(response.getEntity(), null);
  }
}
