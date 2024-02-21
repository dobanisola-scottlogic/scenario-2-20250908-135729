package com.scottlogic.hackathon.server.services.stores;

import java.util.UUID;
import com.google.inject.Inject;
import org.hibernate.SessionFactory;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.scottlogic.hackathon.server.models.Team;
import com.scottlogic.util.StringUtils;

public class TeamStore extends AbstractStore<Team> {
  private final Logger logger;

  @Inject
  public TeamStore(final SessionFactory sessionFactory) {
    super(sessionFactory);
    logger = LoggerFactory.getLogger(this.getClass().getName());
  }

  public Team update(final UUID id, final TeamUpdate update) {
    Team team = get(id);
    if (team != null) {
      String newName = update.getName();
      if (!StringUtils.isNullOrEmpty(newName)) {
        team.setName(newName);
      }

      String newPassword = update.getPassword();
      if (!StringUtils.isNullOrEmpty(newPassword)) {
        team.setPassword(newPassword);
      }

      team = saveOrUpdate(team);
    }

    return team;
  }
}
