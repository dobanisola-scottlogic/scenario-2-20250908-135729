package com.scottlogic.hackathon.server.resources;

import java.util.List;
import javax.annotation.security.RolesAllowed;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import com.codahale.metrics.annotation.Timed;
import com.google.inject.Inject;
import io.dropwizard.auth.Auth;
import io.dropwizard.hibernate.UnitOfWork;

import com.scottlogic.hackathon.server.authentication.Authorizer;
import com.scottlogic.hackathon.server.authentication.User;
import com.scottlogic.hackathon.server.models.MilestoneBot;
import com.scottlogic.hackathon.server.services.MilestoneService;

@Path("/milestone")
@Produces(MediaType.APPLICATION_JSON)
public class MilestoneResource {
  private final MilestoneService milestoneService;

  @Inject
  MilestoneResource(final MilestoneService milestoneService) {
    this.milestoneService = milestoneService;
  }

  @GET
  @UnitOfWork
  @Timed
  @RolesAllowed({Authorizer.ROLE_ADMIN, Authorizer.ROLE_TEAM})
  public List<MilestoneBot> getMilestones(@Auth final User user) {
    return milestoneService.getMilestones();
  }
}
