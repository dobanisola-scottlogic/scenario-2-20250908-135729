package com.scottlogic.hackathon.server.services;

import com.google.inject.Inject;
import com.scottlogic.hackathon.server.models.UploadedJar;
import com.scottlogic.hackathon.server.services.stores.JarStore;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.UUID;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;

public class JarService {
    private final Logger logger;
    private final JarStore jarStore;

    @Inject
    public JarService(final JarStore jarStore) {
        logger = LoggerFactory.getLogger(this.getClass().getName());
        this.jarStore = jarStore;
    }

    public UploadedJar addJar(UploadedJar jar) {
        ScheduledExecutorService executor = Executors.newSingleThreadScheduledExecutor();
        executor.schedule(() -> jarStore.runInSession(() -> jarStore.delete(jar.getId())), 30, TimeUnit.MINUTES);
        executor.shutdown();

        return jarStore.saveOrUpdate(jar);
    }

    public UploadedJar getJar(UUID id) {
        return jarStore.get(id);
    }

    public boolean deleteJar(UUID jarId) {
        return jarStore.delete(jarId);
    }
}
