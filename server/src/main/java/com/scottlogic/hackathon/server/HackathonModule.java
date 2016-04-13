package com.scottlogic.hackathon.server;

import com.google.inject.Binder;
import com.google.inject.Module;
import com.google.inject.Provides;
import io.dropwizard.setup.Environment;

public class HackathonModule implements Module {
    private final HackathonConfiguration configuration;
    private final Environment environment;

    public HackathonModule(final HackathonConfiguration configuration, final Environment environment) {
        this.configuration = configuration;
        this.environment = environment;
    }

    @Override
    public void configure(final Binder binder) {
    }

    @Provides
    public HackathonConfiguration getConfiguration() {
        return configuration;
    }

    @Provides
    public Environment getEnvironment() {
        return environment;
    }
}
