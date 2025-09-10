package com.scottlogic.hackathon.server.models;

import java.util.UUID;
import lombok.EqualsAndHashCode;
import io.dropwizard.auth.basic.BasicCredentials;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.validation.constraints.NotNull;

@Entity
@EqualsAndHashCode
public class Team {
  @Id
  @Column(columnDefinition = "uuid")
  private UUID id;

  @NotNull @Column(unique = true)
  private String name;

  private String password;
  private String hackathonId;

  public Team() {}

  public Team(final UUID id) {
    this.id = id;
  }

  public static Team createTeam(String name) {
    var team = new Team();
    team.setName(name);
    return team;
  }

  public UUID getId() {
    return id;
  }

  public void setId(final UUID id) {
    this.id = id;
  }

  public String getName() {
    return name;
  }

  public void setName(final String name) {
    this.name = name.trim().replaceAll("\\s+", " ");;
  }

  public String getPassword() {
    return password;
  }

  public void setPassword(final String password) {
    this.password = password;
  }

  public boolean authenticate(final BasicCredentials credentials) {
    // Use constant-time comparison to prevent timing attacks
    return credentials.getUsername().equals(name) && constantTimeEquals(credentials.getPassword(), password);
  }

  // Constant-time string comparison to prevent timing attacks
  private boolean constantTimeEquals(String a, String b) {
    if (a == null || b == null) {
      return a == b;
    }
    if (a.length() != b.length()) {
      return false;
    }
    int result = 0;
    for (int i = 0; i < a.length(); i++) {
      result |= a.charAt(i) ^ b.charAt(i);
    }
    return result == 0;
  }

  public String getHackathonId() {
    return hackathonId;
  }

  public void setHackathonId(final String hackathonId) {
    this.hackathonId = hackathonId;
  }
}
