package com.scottlogic.hackathon.server;

import com.google.inject.Guice;
import com.google.inject.Injector;
import com.scottlogic.hackathon.server.authentication.Authenticator;
import com.scottlogic.hackathon.server.authentication.Authorizer;
import com.scottlogic.hackathon.server.authentication.User;
import com.scottlogic.hackathon.server.healthchecks.HackathonHealthCheck;
import com.scottlogic.hackathon.server.resources.GameResource;
import com.scottlogic.hackathon.server.resources.HackathonResource;
import com.scottlogic.hackathon.server.resources.TeamResource;
import io.dropwizard.Application;
import io.dropwizard.auth.AuthDynamicFeature;
import io.dropwizard.auth.AuthValueFactoryProvider;
import io.dropwizard.auth.basic.BasicCredentialAuthFilter;
import io.dropwizard.setup.Bootstrap;
import io.dropwizard.setup.Environment;
import org.glassfish.jersey.server.filter.RolesAllowedDynamicFeature;

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

        environment.jersey().register(new AuthDynamicFeature(new BasicCredentialAuthFilter.Builder<User>()
                .setAuthenticator(new Authenticator())
                .setAuthorizer(new Authorizer())
                .setRealm("Restricted Access")
                .buildAuthFilter()));
        environment.jersey().register(new AuthValueFactoryProvider.Binder<>(User.class));
        environment.jersey().register(RolesAllowedDynamicFeature.class);

        environment.jersey().register(injector.getInstance(HackathonResource.class));
        environment.jersey().register(injector.getInstance(GameResource.class));
        environment.jersey().register(injector.getInstance(TeamResource.class));

        environment.healthChecks().register("hackathon", injector.getInstance(HackathonHealthCheck.class));
    }
}
