package com.scottlogic.hackathon.server.resources;

import javax.annotation.security.RolesAllowed;
import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import com.codahale.metrics.annotation.Timed;
import com.google.inject.Inject;
import io.dropwizard.hibernate.UnitOfWork;

import com.scottlogic.hackathon.server.HackathonConfiguration;
import com.scottlogic.hackathon.server.authentication.Authorizer;
import com.scottlogic.hackathon.server.models.AdminUser;
import com.scottlogic.hackathon.server.services.AdminService;

@Path("/admin")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class AdminResource {
  private final HackathonConfiguration hackathonConfiguration;
  private final AdminService adminService;

  @Inject
  public AdminResource(
      final HackathonConfiguration hackathonConfiguration, final AdminService adminService) {
    this.hackathonConfiguration = hackathonConfiguration;
    this.adminService = adminService;
  }

  @PUT
  @UnitOfWork
  @Timed
  @RolesAllowed(Authorizer.ROLE_ADMIN)
  @Consumes(MediaType.APPLICATION_JSON)
  @Produces(MediaType.APPLICATION_JSON)
  public AdminUser updateAdmin(final String adminPassword) {
    return adminService.updateAdmin(adminPassword);
  }
}
