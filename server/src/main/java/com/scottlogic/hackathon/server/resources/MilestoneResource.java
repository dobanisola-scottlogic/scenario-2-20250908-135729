package com.scottlogic.hackathon.server.resources;

import com.codahale.metrics.annotation.Timed;
import com.google.inject.Inject;
import com.scottlogic.hackathon.server.HackathonConfiguration;
import com.scottlogic.hackathon.server.authentication.Authorizer;
import com.scottlogic.hackathon.server.authentication.User;
import com.scottlogic.hackathon.server.models.MilestoneBot;
import com.scottlogic.hackathon.server.services.MilestoneService;
import io.dropwizard.auth.Auth;
import io.dropwizard.hibernate.UnitOfWork;
import org.hibernate.Session;
import org.hibernate.SessionFactory;

import javax.annotation.security.RolesAllowed;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import java.util.List;

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
    public List<MilestoneBot> getUploadedMilestones(@Auth final User user) {
        return milestoneService.getMilestones();
    }

}
