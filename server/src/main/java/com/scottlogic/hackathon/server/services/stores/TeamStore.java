package com.scottlogic.hackathon.server.services.stores;

import com.google.inject.Inject;
import com.scottlogic.hackathon.server.models.Team;
import org.hibernate.SessionFactory;
import org.hibernate.criterion.Restrictions;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.List;
import java.util.UUID;

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
            if (update.getName() != null) {
                team.setName(update.getName());
            }

            if (update.getPassword() != null) {
                team.setPassword(update.getPassword());
            }

            team = saveOrUpdate(team);
        }

        return team;
    }
}
