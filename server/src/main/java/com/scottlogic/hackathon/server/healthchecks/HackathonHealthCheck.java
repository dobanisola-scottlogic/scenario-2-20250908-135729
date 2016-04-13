package com.scottlogic.hackathon.server.healthchecks;

import com.codahale.metrics.health.HealthCheck;
import com.google.inject.Inject;
import com.scottlogic.hackathon.server.resources.HackathonResource;

public class HackathonHealthCheck extends HealthCheck {
    private final HackathonResource hackathonResource;

    @Inject
    public HackathonHealthCheck(final HackathonResource hackathonResource) {
        this.hackathonResource = hackathonResource;
    }

    @Override
    protected Result check() throws Exception {
        final String name = hackathonResource.getHackathon().getName();
        if (name.equals("Code Challenge")) {
            return Result.healthy();
        } else {
            return Result.unhealthy("incorrect name " + name);
        }
    }
}
