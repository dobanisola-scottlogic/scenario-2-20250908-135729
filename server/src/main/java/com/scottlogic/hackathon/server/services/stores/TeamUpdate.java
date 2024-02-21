package com.scottlogic.hackathon.server.services.stores;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
public class TeamUpdate {
  private String name;
  private String password;

  public String getName() {
    return name;
  }

  public void setName(final String name) {
    this.name = name == null ? null : name.trim().replaceAll("\\s+", " ");
  }

  public String getPassword() {
    return password;
  }

  public void setPassword(final String password) {
    this.password = password;
  }
}
