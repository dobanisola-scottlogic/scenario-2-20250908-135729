package com.scottlogic.hackathon.server.resources;

import com.codahale.metrics.annotation.Timed;
import com.google.inject.Inject;
import com.scottlogic.hackathon.server.HackathonConfiguration;
import com.scottlogic.hackathon.server.models.Hackathon;

import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;

@Path("/hackathon")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class HackathonResource {
    private final HackathonConfiguration hackathonConfiguration;

    @Inject
    public HackathonResource(final HackathonConfiguration hackathonConfiguration) {
        this.hackathonConfiguration = hackathonConfiguration;
    }

    @GET
    @Timed
    public Hackathon getHackathon() {
        return new Hackathon(hackathonConfiguration.getName());
    }
}
