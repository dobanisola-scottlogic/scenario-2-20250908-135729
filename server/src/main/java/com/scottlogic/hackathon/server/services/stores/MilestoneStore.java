package com.scottlogic.hackathon.server.services.stores;

import com.google.inject.Inject;
import com.scottlogic.hackathon.server.HackathonConfiguration;
import com.scottlogic.hackathon.server.models.MilestoneBot;
import org.hibernate.SessionFactory;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class MilestoneStore extends AbstractStore<MilestoneBot> {
    private final Logger logger;

    @Inject
    public MilestoneStore(final SessionFactory sessionFactory,
                          final HackathonConfiguration hackathonConfiguration) {
        super(sessionFactory);
        this.logger = LoggerFactory.getLogger(this.getClass().getName());
        runInSession(() -> {
            list().forEach(milestoneBot -> delete(milestoneBot.getId()));
            hackathonConfiguration.getMilestoneBots().forEach(milestoneBot -> saveOrUpdate(milestoneBot));
        });
    }
}
