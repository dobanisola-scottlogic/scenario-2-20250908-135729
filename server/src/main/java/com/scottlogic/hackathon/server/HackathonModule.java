package com.scottlogic.hackathon.server;

import com.google.inject.Binder;
import com.google.inject.Module;
import com.google.inject.Provides;
import com.scottlogic.hackathon.server.services.BotThreadFactory;
import io.dropwizard.hibernate.HibernateBundle;
import io.dropwizard.setup.Environment;
import org.hibernate.SessionFactory;

import java.util.concurrent.ThreadFactory;

public class HackathonModule implements Module {
    private final HackathonConfiguration configuration;
    private final Environment environment;
    private final HibernateBundle<HackathonConfiguration> hibernateBundle;
    private final ThreadFactory botThreadFactory;

    public HackathonModule(final HackathonConfiguration configuration, final Environment environment,
            final HibernateBundle<HackathonConfiguration> hibernateBundle, final ThreadFactory botThreadFactory) {
        this.configuration = configuration;
        this.environment = environment;
        this.hibernateBundle = hibernateBundle;
        this.botThreadFactory = botThreadFactory;
    }

    @Override
    public void configure(final Binder binder) {}

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

    @Provides @BotThreadFactory
    public ThreadFactory getBotThreadFactory() {
        return botThreadFactory;
    }
}