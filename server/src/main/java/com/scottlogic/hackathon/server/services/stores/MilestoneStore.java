package com.scottlogic.hackathon.server.services.stores;

import com.google.inject.Inject;
import com.scottlogic.hackathon.server.HackathonConfiguration;
import com.scottlogic.hackathon.server.models.MilestoneBot;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.context.internal.ManagedSessionContext;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public class MilestoneStore extends AbstractStore<MilestoneBot> {
    private final Logger logger;
    SessionFactory sessionFactory;

    @Inject
    public MilestoneStore(final SessionFactory sessionFactory,
                          final HackathonConfiguration hackathonConfiguration) {
        super(sessionFactory);
        this.logger = LoggerFactory.getLogger(this.getClass().getName());
        this.sessionFactory = sessionFactory;
        initialise(hackathonConfiguration.getMilestoneBots());
    }

    public void initialise(List<MilestoneBot> milestoneBots) {
        Session currentSession = sessionFactory.openSession();
        ManagedSessionContext.bind(currentSession);
        currentSession.beginTransaction();
        list().forEach(milestoneBot -> delete(milestoneBot.getId()));
        milestoneBots.forEach(milestoneBot -> saveOrUpdate(milestoneBot));
        ManagedSessionContext.unbind(sessionFactory);
        currentSession.getTransaction().commit();
        currentSession.close();
    }

}
