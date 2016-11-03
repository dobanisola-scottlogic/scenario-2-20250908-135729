package com.scottlogic.hackathon.server.services.stores;

import com.google.inject.Inject;
import com.scottlogic.hackathon.server.models.AdminUser;
import org.hibernate.SessionFactory;
import org.hibernate.criterion.Restrictions;
import org.hibernate.Session;
import org.hibernate.context.internal.ManagedSessionContext;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.UUID;

public class AdminStore extends AbstractStore<AdminUser> {
    private final Logger logger;
    SessionFactory sessionFactory;

    @Inject
    public AdminStore(final SessionFactory sessionFactory) {
        super(sessionFactory);
        logger = LoggerFactory.getLogger(this.getClass().getName());
        this.sessionFactory = sessionFactory;
        initialise();
    }

    public void initialise() {
        runInSession(() -> {
            saveOrUpdate(AdminUser.getAdmin());
        });
    }

    public AdminUser updateAdmin(final String adminPassword) {
        AdminUser admin = getAdminUser();
        if (adminPassword != null) {
            admin.setPassword(adminPassword);
            admin = saveOrUpdate(admin);
        }

        return admin;
    }

    public AdminUser getAdminUser() {
        return get(AdminUser.getAdminId());
    }
}
