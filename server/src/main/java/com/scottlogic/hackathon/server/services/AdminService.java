package com.scottlogic.hackathon.server.services;

import com.google.inject.Inject;

import com.scottlogic.hackathon.server.models.AdminUser;
import com.scottlogic.hackathon.server.services.stores.AdminStore;

public class AdminService {
  private final AdminStore adminStore;

  @Inject
  public AdminService(final AdminStore adminStore) {
    this.adminStore = adminStore;
  }

  public AdminUser getAdmin() {
    return adminStore.getAdminUser();
  }

  public AdminUser updateAdmin(final String adminPassword) {
    return adminStore.updateAdmin(adminPassword);
  }
}
