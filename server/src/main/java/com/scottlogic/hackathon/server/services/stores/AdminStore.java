package com.scottlogic.hackathon.server.services.stores;

import com.google.inject.Inject;
import org.hibernate.SessionFactory;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.scottlogic.hackathon.server.models.AdminUser;

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
    runInSession(
        () -> {
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
