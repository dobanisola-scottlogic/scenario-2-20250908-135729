package com.scottlogic.hackathon.server;

import com.google.inject.Binder;
import com.google.inject.Module;
import com.google.inject.Provides;
import io.dropwizard.hibernate.HibernateBundle;
import io.dropwizard.setup.Environment;
import org.hibernate.SessionFactory;

public class HackathonModule implements Module {
    private final HackathonConfiguration configuration;
    private final Environment environment;
    private final HibernateBundle<HackathonConfiguration> hibernateBundle;

    public HackathonModule(final HackathonConfiguration configuration,
                           final Environment environment,
                           final HibernateBundle<HackathonConfiguration> hibernateBundle) {
        this.configuration = configuration;
        this.environment = environment;
        this.hibernateBundle = hibernateBundle;
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

    @Provides
    public SessionFactory provideSessionFactory() {
        return hibernateBundle.getSessionFactory();
    }
}