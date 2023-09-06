package com.scottlogic.hackathon.server.services.stores;

import com.google.inject.Inject;
import org.hibernate.SessionFactory;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.scottlogic.hackathon.server.models.GameResult;

public class GameStore extends AbstractStore<GameResult> {
  private final Logger logger;

  @Inject
  public GameStore(final SessionFactory sessionFactory) {
    super(sessionFactory);
    logger = LoggerFactory.getLogger(this.getClass().getName());
  }
}
