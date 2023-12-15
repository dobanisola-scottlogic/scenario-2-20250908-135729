package com.scottlogic.hackathon.server.models;

import javax.persistence.Entity;
import software.amazon.awssdk.services.cloud9.model.Environment;

@Entity
public class TeamInfo {
  public String accountId;
  public String userName;
  public String password;
  public String devEnvironment;

  private TeamInfo(String accountId, String userName, String devEnvironment) {
    this.accountId = accountId;
    this.userName = userName;
    this.password = System.getenv("CONTESTANT_PASSWORD");
    this.devEnvironment = devEnvironment;
  }

  public static TeamInfo fromEnvironment(Environment environment) {
    // Get account ID, username and Cloud9 environment ID from relevant ARNs
    // according to known formats
    //
    // Environment ARN:
    // arn:partition:service:region:account-id:resource-type:resource-id
    //
    // Owner ARN:
    // arn:partition:service:region:account-id:resource-type/resource-id
    //
    // N.B. We expect the region and account ID to be the same in both the
    // environment and owner ARN, but extract them separately for correctness.
    //
    // https://docs.aws.amazon.com/IAM/latest/UserGuide/reference-arns.html
    String region = environment.arn().split(":")[3];
    String accountId = environment.arn().split(":")[4];
    String userName = environment.ownerArn().split("/")[1];
    String environmentId = environment.id();
    String devEnvironment = String.format("https://%s.console.aws.amazon.com/cloud9/ide/%s",
        region, environmentId);

    return new TeamInfo(accountId, userName, devEnvironment);
  }
}
