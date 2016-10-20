package com.scottlogic.hackathon.server.services.stores;


import com.google.inject.Inject;
import com.scottlogic.hackathon.server.models.GameResult;
import org.hibernate.SessionFactory;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class GameStore extends AbstractStore<GameResult> {
    private final Logger logger;

    @Inject
    public GameStore(final SessionFactory sessionFactory) {
        super(sessionFactory);
        logger = LoggerFactory.getLogger(this.getClass().getName());
    }
}