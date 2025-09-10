package com.scottlogic.hackathon.server.models;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.BeforeEach;
import java.lang.reflect.Field;
import java.util.Map;
import static org.junit.jupiter.api.Assertions.assertEquals;

public class AdminUserTest {

  @BeforeEach
  void resetAdminUserState() throws Exception {
    // Reset the static admin instance for each test
    Field adminField = AdminUser.class.getDeclaredField("admin");
    adminField.setAccessible(true);
    adminField.set(null, null);
  }

  @Test
  void testDefaultPasswordWhenNoEnvironmentVariable() {
    // When no ADMIN_PASSWORD environment variable is set
    AdminUser admin = AdminUser.getAdmin();
    
    // Then it should use the default "secret" password
    assertEquals("secret", admin.getPassword());
  }

  @Test
  void testCustomPasswordFromEnvironmentVariable() throws Exception {
    // Given an ADMIN_PASSWORD environment variable is set
    setEnvironmentVariable("ADMIN_PASSWORD", "custom-secure-password");
    
    try {
      // When getting the admin user
      AdminUser admin = AdminUser.getAdmin();
      
      // Then it should use the custom password
      assertEquals("custom-secure-password", admin.getPassword());
    } finally {
      // Clean up
      clearEnvironmentVariable("ADMIN_PASSWORD");
    }
  }

  @Test
  void testEmptyPasswordEnvironmentVariableUsesDefault() throws Exception {
    // Given an empty ADMIN_PASSWORD environment variable
    setEnvironmentVariable("ADMIN_PASSWORD", "");
    
    try {
      // When getting the admin user
      AdminUser admin = AdminUser.getAdmin();
      
      // Then it should use the default password
      assertEquals("secret", admin.getPassword());
    } finally {
      // Clean up
      clearEnvironmentVariable("ADMIN_PASSWORD");
    }
  }

  // Helper method to set environment variables for testing
  @SuppressWarnings("unchecked")
  private void setEnvironmentVariable(String key, String value) throws Exception {
    Class<?> processEnvironmentClass = Class.forName("java.lang.ProcessEnvironment");
    Field theEnvironmentField = processEnvironmentClass.getDeclaredField("theEnvironment");
    theEnvironmentField.setAccessible(true);
    Map<String, String> env = (Map<String, String>) theEnvironmentField.get(null);
    env.put(key, value);
  }

  // Helper method to clear environment variables for testing
  @SuppressWarnings("unchecked")
  private void clearEnvironmentVariable(String key) throws Exception {
    Class<?> processEnvironmentClass = Class.forName("java.lang.ProcessEnvironment");
    Field theEnvironmentField = processEnvironmentClass.getDeclaredField("theEnvironment");
    theEnvironmentField.setAccessible(true);
    Map<String, String> env = (Map<String, String>) theEnvironmentField.get(null);
    env.remove(key);
  }
}