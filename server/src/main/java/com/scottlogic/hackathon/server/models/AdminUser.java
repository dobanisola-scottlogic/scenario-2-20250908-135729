package com.scottlogic.hackathon.server.models;

import java.util.UUID;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.validation.constraints.NotNull;

@Entity
public class AdminUser {
  private static AdminUser admin;
  private static UUID adminId;

  @Id
  @Column(columnDefinition = "uuid")
  private UUID id;

  @NotNull private String password;

  public AdminUser() {}

  private AdminUser(UUID id, String password) {
    this.id = id;
    this.password = password;
  }

  public static AdminUser getAdmin() {
    if (admin == null) {
      adminId = UUID.randomUUID();
      // Read admin password from environment variable, fallback to default for development
      String adminPassword = System.getenv("ADMIN_PASSWORD");
      if (adminPassword == null || adminPassword.trim().isEmpty()) {
        adminPassword = "secret"; // Development fallback - should be changed in production
      }
      admin = new AdminUser(adminId, adminPassword);
    }
    return admin;
  }

  public static UUID getAdminId() {
    return adminId;
  }

  public void setPassword(final String password) {
    this.password = password;
  }

  public String getPassword() {
    return this.password;
  }
}
