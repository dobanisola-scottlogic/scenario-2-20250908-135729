package com.scottlogic.hackathon.server;

import com.google.inject.Guice;
import com.google.inject.Injector;
import com.scottlogic.hackathon.server.healthchecks.HackathonHealthCheck;
import com.scottlogic.hackathon.server.resources.GameResource;
import com.scottlogic.hackathon.server.resources.HackathonResource;
import io.dropwizard.Application;
import io.dropwizard.setup.Bootstrap;
import io.dropwizard.setup.Environment;

public class HackathonApplication extends Application<HackathonConfiguration> {
    public static void main(final String[] args) throws Exception {
        new HackathonApplication().run(args);
    }

    @Override
    public String getName() {
        return "hackathon";
    }

    @Override
    public void initialize(final Bootstrap<HackathonConfiguration> bootstrap) {
    }

    @Override
    public void run(final HackathonConfiguration configuration, final Environment environment) {
        final Injector injector = Guice.createInjector(new HackathonModule(configuration, environment));

        environment.jersey().register(injector.getInstance(HackathonResource.class));
        environment.jersey().register(injector.getInstance(GameResource.class));

        environment.healthChecks().register("hackathon", injector.getInstance(HackathonHealthCheck.class));
    }
}
