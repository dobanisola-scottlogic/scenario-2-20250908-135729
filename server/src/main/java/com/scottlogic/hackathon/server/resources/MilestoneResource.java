package com.scottlogic.hackathon.server.resources;

import com.codahale.metrics.annotation.Timed;
import com.google.inject.Inject;
import com.scottlogic.hackathon.server.HackathonConfiguration;
import com.scottlogic.hackathon.server.authentication.Authorizer;
import com.scottlogic.hackathon.server.authentication.User;
import com.scottlogic.hackathon.server.models.MilestoneBot;
import com.scottlogic.hackathon.server.services.MilestoneService;
import io.dropwizard.auth.Auth;
import org.glassfish.jersey.media.multipart.FormDataParam;

import javax.annotation.security.RolesAllowed;
import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import java.io.InputStream;
import java.util.List;
import java.util.UUID;

@Path("/milestone")
@Produces(MediaType.APPLICATION_JSON)
public class MilestoneResource {
    private final MilestoneService milestoneService;
    private final HackathonConfiguration hackathonConfiguration;

    @Inject
    MilestoneResource(final HackathonConfiguration hackathonConfiguration,
                      final MilestoneService milestoneService) {
        this.hackathonConfiguration = hackathonConfiguration;
        this.milestoneService = milestoneService;
        this.addMilestones(hackathonConfiguration.getMilestoneBots());
    }

    private void addMilestones(final List<MilestoneBot> milestoneBots) {
        milestoneService.getMilestones().forEach(milestoneBot -> milestoneService.deleteMilestone(milestoneBot.getId()));
        milestoneBots.forEach(milestoneBot -> addMilestone(milestoneBot));
    }

    public void addMilestone(final MilestoneBot milestoneBot) {
        milestoneService.addMilestone(milestoneBot);
    }

    @GET
    @Timed
    @RolesAllowed({Authorizer.ROLE_ADMIN, Authorizer.ROLE_TEAM})
    public List<MilestoneBot> getUploadedMilestones(@Auth final User user) {
        return milestoneService.getMilestones();
    }

}
