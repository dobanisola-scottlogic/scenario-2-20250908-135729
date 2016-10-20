package com.scottlogic.hackathon.server.services.stores;

import com.google.inject.Inject;
import com.scottlogic.hackathon.server.models.Team;
import com.scottlogic.hackathon.server.models.UploadedBot;
import org.hibernate.SessionFactory;
import org.hibernate.criterion.Restrictions;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.List;
import java.util.UUID;

public class BotStore extends AbstractStore<UploadedBot> {
    private final Logger logger;

    @Inject
    public BotStore(final SessionFactory sessionFactory) {
        super(sessionFactory);
        logger = LoggerFactory.getLogger(this.getClass().getName());
    }

    public UploadedBot setActiveBot(final UploadedBot uploadedBot) {
        UploadedBot currentActiveBot = get(Restrictions.and(Restrictions.eq("teamId", uploadedBot.getTeamId().toString()), Restrictions.eq("active", true)));

        if (currentActiveBot != null) {
            currentActiveBot.setActive(false);
            saveOrUpdate(currentActiveBot);
        }

        uploadedBot.setActive(true);

        return saveOrUpdate(uploadedBot);
    }
}
