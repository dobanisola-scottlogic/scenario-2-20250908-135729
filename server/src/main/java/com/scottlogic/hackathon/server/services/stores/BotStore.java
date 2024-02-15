package com.scottlogic.hackathon.server.services.stores;

import java.util.Optional;
import java.util.UUID;
import com.google.inject.Inject;
import io.dropwizard.hibernate.UnitOfWork;
import org.hibernate.SessionFactory;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.scottlogic.hackathon.game.UniqueIdGenerator;
import com.scottlogic.hackathon.server.models.TeamBot;

import static java.util.Optional.ofNullable;

public class BotStore extends AbstractStore<TeamBot> {
  private final Logger logger;

  @Inject
  public BotStore(final SessionFactory sessionFactory) {
    super(sessionFactory);
    logger = LoggerFactory.getLogger(this.getClass().getName());
  }

  @UnitOfWork
  public void configureIdGenerator() {
    runInSession(
        () -> {
          Optional<Long> maxId = ofNullable(
              currentSession()
                  .createQuery("select max(bot.id) from TeamBot bot", Long.class)
                  .getSingleResultOrNull());
          UniqueIdGenerator.INSTANCE.setSeed(maxId.orElse(1L));
        });
  }

  public TeamBot getByTeamId(UUID teamId) {
    return get("teamId", teamId.toString());
  }

  public boolean deleteExisting(UUID teamId) {
    return list("teamId", teamId.toString()).stream()
        .map(t -> t.getId().getId())
        .map(this::delete)
        .findFirst()
        .isPresent();
  }
}
