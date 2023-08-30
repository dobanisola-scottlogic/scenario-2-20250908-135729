package com.scottlogic.hackathon.server.models;

import java.util.UUID;
import javax.persistence.*;
import javax.validation.constraints.NotNull;
import io.dropwizard.auth.basic.BasicCredentials;

@Entity
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
    this.name = name;
  }

  public void setPassword(final String password) {
    this.password = password;
  }

  public boolean authenticate(final BasicCredentials credentials) {
    return credentials.getUsername().equals(name) && credentials.getPassword().equals(password);
  }

  public String getHackathonId() {
    return hackathonId;
  }

  public void setHackathonId(final String hackathonId) {
    this.hackathonId = hackathonId;
  }
}
