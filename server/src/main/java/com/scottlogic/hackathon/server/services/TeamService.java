package com.scottlogic.hackathon.server.services;

import java.util.List;
import java.util.UUID;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import com.google.inject.Inject;
import io.dropwizard.auth.basic.BasicCredentials;
import org.hibernate.criterion.Restrictions;
import org.slf4j.Logger;
import software.amazon.awssdk.services.cloud9.Cloud9Client;
import software.amazon.awssdk.services.cloud9.model.Cloud9Exception;
import software.amazon.awssdk.services.cloud9.model.DescribeEnvironmentsRequest;
import software.amazon.awssdk.services.cloud9.model.DescribeEnvironmentsResponse;
import software.amazon.awssdk.services.cloud9.model.Environment;
import software.amazon.awssdk.services.cloud9.model.ListEnvironmentsResponse;

import com.scottlogic.hackathon.server.models.Team;
import com.scottlogic.hackathon.server.models.TeamInfo;
import com.scottlogic.hackathon.server.services.stores.TeamStore;
import com.scottlogic.hackathon.server.services.stores.TeamUpdate;

public class TeamService {
  private final Logger logger;
  private final TeamStore teamStore;
  private final Cloud9Client cloud9;
  private final String workspace;
  final static Pattern teamNumberPattern = Pattern.compile("([0-9]+)$");

  @Inject
  public TeamService(final TeamStore teamStore) {
    this.teamStore = teamStore;
    cloud9 = Cloud9Client.builder().build();
    workspace = System.getenv("WORKSPACE");
    logger = org.slf4j.LoggerFactory.getLogger(this.getClass().getName());
  }

  public Team addTeam(final Team team) {
    var existing = teamStore.get(Restrictions.eq("name", team.getName()).ignoreCase());
    if (existing != null) {
      throw new IllegalArgumentException("Team name already exists");
    }

    team.setId(UUID.randomUUID());
    return teamStore.save(team);
  }

  public List<Team> getTeams() {
    return teamStore.list();
  }

  public List<Team> getTeamsByHackathon(final String hackathonId) {
    return teamStore.list(Restrictions.eq("hackathonId", hackathonId));
  }

  public Team getTeam(final UUID id) {
    return teamStore.get(id);
  }

  public Team getTeam(final String name) {
    return teamStore.get(Restrictions.eq("name", name));
  }

  public Team updateTeam(final UUID id, final TeamUpdate teamUpdate) {
    return teamStore.update(id, teamUpdate);
  }

  public boolean deleteTeam(final UUID id) {
    return teamStore.delete(id);
  }

  public boolean authenticate(final BasicCredentials credentials) {
    final Team team = getTeam(credentials.getUsername());
    return team != null && team.authenticate(credentials);
  }

  private Environment getTeamDevEnvironment(String teamName) {
    try {
      ListEnvironmentsResponse listResponse = cloud9.listEnvironments();

      DescribeEnvironmentsRequest describeRequest = DescribeEnvironmentsRequest.builder()
          .environmentIds(listResponse.environmentIds())
          .build();
      DescribeEnvironmentsResponse describeResponse = cloud9.describeEnvironments(describeRequest);

      Matcher matcher = teamNumberPattern.matcher(teamName);
      if (matcher.find()) {
        int teamNumber = Integer.parseInt(matcher.group());
        String instanceName = String.format("%s-%02d", workspace, teamNumber);

        for (Environment environment : describeResponse.environments()) {
          if (environment.name().equals(instanceName)) {
            return environment;
          }
        }
      }
    } catch (Cloud9Exception cloud9Exception) {
      logger.debug("Cloud9Exception: " + cloud9Exception.getMessage());
    }

    return null;
  }

  public TeamInfo getTeamInfo(String teamName) {
    TeamInfo teamInfo = null;
    Environment environment = getTeamDevEnvironment(teamName);

    if (environment != null) {
      teamInfo = TeamInfo.fromEnvironment(environment);
    }

    return teamInfo;
  }
}
