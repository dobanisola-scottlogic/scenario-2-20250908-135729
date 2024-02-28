package com.scottlogic.hackathon.server.services;

import java.util.List;
import java.util.UUID;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import com.google.common.base.Preconditions;
import com.google.inject.Inject;
import io.dropwizard.auth.basic.BasicCredentials;
import org.slf4j.Logger;
import software.amazon.awssdk.auth.credentials.EnvironmentVariableCredentialsProvider;
import software.amazon.awssdk.core.SdkSystemSetting;
import software.amazon.awssdk.regions.Region;
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
import com.scottlogic.util.StringUtils;

public class TeamService {
  private final Logger logger;
  private final TeamStore teamStore;
  private final HackathonService hackathonService;
  private final Cloud9Client cloud9;
  static final Pattern teamNumberPattern = Pattern.compile("(\\d+)$");

  @Inject
  public TeamService(final TeamStore teamStore, final HackathonService hackathonService) {
    this.teamStore = teamStore;
    this.hackathonService = hackathonService;
    cloud9 = Cloud9Client.builder()
      .region(getRegion())
      .credentialsProvider(EnvironmentVariableCredentialsProvider.create())
      .build();
    logger = org.slf4j.LoggerFactory.getLogger(this.getClass().getName());
  }

  private Region getRegion() {
    // Attempt to use environment variable or fallback to default region
    String awsRegion = System.getenv(SdkSystemSetting.AWS_REGION.environmentVariable());
    return awsRegion != null ? Region.of(awsRegion) : Region.EU_WEST_2;
  }
  
  public String getWorkspace() {
    return System.getenv("WORKSPACE");
  }

  public Team addTeam(final Team team) {
    
    validateTeamName(team.getName());
    validatePassword(team.getPassword());

    var existing = teamStore.get("name", team.getName(), true);
    if (existing != null) {
      throw new IllegalArgumentException("Team name already exists");
    }
    if (hackathonService.getHackathon(team.getHackathonId()) == null) {
      throw new IllegalArgumentException(String.format("Hackathon with ID '%s' not found", team.getHackathonId()));
    }

    team.setId(UUID.randomUUID());
    return teamStore.save(team);
  }

  public List<Team> getTeams() {
    return teamStore.list();
  }

  public List<Team> getTeamsByHackathon(final String hackathonId) {
    return teamStore.list("hackathonId", hackathonId, false);
  }

  public Team getTeam(final UUID id) {
    return teamStore.get(id);
  }

  public Team getTeam(final String name) {
    return teamStore.get("name", name, true);
  }

  public Team updateTeam(final UUID id, final TeamUpdate teamUpdate) {
    String newName = teamUpdate.getName();
    String newPassword = teamUpdate.getPassword();

    Preconditions.checkArgument(
      !StringUtils.isNullOrEmpty(newName)
      || !StringUtils.isNullOrEmpty(newPassword),
      "Nothing to change"
    );

    if(!StringUtils.isNullOrEmpty(newName)) {
      validateTeamName(newName);

      var existing = teamStore.get("name", teamUpdate.getName(), true);

      // Java's UUID equality comparison is by value, taking into account the version and variant fields.
      // Use equals() to test for value equality:
      if (existing != null && !existing.getId().equals(id)) {
        throw new IllegalArgumentException("Team name already exists");
      }
    }

    if(!StringUtils.isNullOrEmpty(newPassword)) {
      validatePassword(newPassword);
    }

    return teamStore.update(id, teamUpdate);
  }

  public boolean deleteTeam(final UUID id) {
    return teamStore.delete(id);
  }

  public boolean authenticate(final BasicCredentials credentials) {
    final Team team = getTeam(credentials.getUsername());
    return team != null && team.authenticate(credentials);
  }

  private void validateTeamName(String name) {
    Preconditions.checkArgument(
      !StringUtils.isNullOrBlank(name),
      "Team name cannot be blank");
  }

  private void validatePassword(String password) {
    Preconditions.checkArgument(
      !StringUtils.isNullOrEmpty(password),
      "Team password cannot be empty"
    );
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
        String instanceName = String.format("%s-%02d", getWorkspace(), teamNumber);

        for (Environment environment : describeResponse.environments()) {
          if (environment.name().equals(instanceName)) {
            return environment;
          }
        }
      }
    } catch (Cloud9Exception cloud9Exception) {
      logger.debug("Cloud9Exception: {}", cloud9Exception.getMessage());
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
