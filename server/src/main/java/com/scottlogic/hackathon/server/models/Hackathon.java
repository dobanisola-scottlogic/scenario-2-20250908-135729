package com.scottlogic.hackathon.server.models;

import java.util.List;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.OneToMany;
import com.fasterxml.jackson.annotation.JsonView;
import lombok.Data;

@Data
@Entity
public class Hackathon {
  @Id private String id;
  private String name;

  @JsonView(Views.List.class)
  @OneToMany
  private List<GameResult> games;

  @JsonView(Views.List.class)
  @OneToMany
  private List<Team> teams;

  private String currentMilestoneClassName;
  private String currentMilestoneMap;

  public Hackathon() {}

  public Hackathon(final String name) {
    this.setName(name);
    this.currentMilestoneClassName = MilestoneBot.MILESTONE_BOT_PREFIX + "Milestone1Bot";
    this.currentMilestoneMap = "Easy";
  }

  public void setName(final String name) {
    this.name = name.trim().replaceAll("\\s+", " ");
    this.id = this.name.toLowerCase().replace(" ", "-");
  }
}
