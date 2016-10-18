package com.scottlogic.hackathon.server.services.stores;

import com.google.inject.Inject;
import com.scottlogic.hackathon.server.models.Hackathon;
import com.scottlogic.hackathon.server.models.HackathonUpdate;
import org.hibernate.SessionFactory;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.List;
import java.util.UUID;

public class HackathonStore extends AbstractStore<Hackathon> {
    private final Logger logger;

    @Inject
    HackathonStore(final SessionFactory sessionFactory) {
        super(sessionFactory);
        logger = LoggerFactory.getLogger(this.getClass().getName());
    }

    public Hackathon update(final UUID id, final HackathonUpdate hackathonUpdate) {
        Hackathon hackathon = get(id);
        if (hackathon != null) {
            if (hackathonUpdate.getMilestoneClassName() != null) {
                hackathon.setCurrentMilestoneClassName(hackathonUpdate.getMilestoneClassName());
            }
            if (hackathonUpdate.getMilestoneMap() != null) {
                hackathon.setCurrentMilestoneMap(hackathonUpdate.getMilestoneMap());
            }
            hackathon = saveOrUpdate(hackathon);
        }
        return saveOrUpdate(hackathon);
    }
}
