package com.scottlogic.hackathon.server.database;

import com.sleepycat.je.DatabaseException;
import com.sleepycat.je.Environment;
import com.sleepycat.je.EnvironmentConfig;
import com.sleepycat.persist.EntityStore;
import com.sleepycat.persist.StoreConfig;
import com.sleepycat.persist.model.AnnotationModel;

import java.io.File;

public class Database {
    private final Environment environment;
    private final EntityStore entityStore;

    public Database() throws DatabaseException {
        final EnvironmentConfig environmentConfig = new EnvironmentConfig();
        final StoreConfig storeConfig = new StoreConfig();

        final AnnotationModel annotationModel = new AnnotationModel();
        annotationModel.registerClass(UUIDProxy.class);
        storeConfig.setModel(annotationModel);
        storeConfig.setAllowCreate(true);
        storeConfig.setReadOnly(false);

        environmentConfig.setAllowCreate(true);
        storeConfig.setAllowCreate(true);

        environment = new Environment(getEnvironmentDirectory(), environmentConfig);
        entityStore = new EntityStore(environment, "EntityStore", storeConfig);
    }

    private File getEnvironmentDirectory() {
        final String environmentPath = "/tmp/database";
        final File environmentDirectory = new File(environmentPath);

        if (!environmentDirectory.exists()) {
            environmentDirectory.mkdirs();
        }

        return environmentDirectory;
    }

    public void close() {
        if (entityStore != null) {
            entityStore.close();
        }

        if (environment != null) {
            environment.close();
        }
    }

    public EntityStore getEntityStore() {
        return entityStore;
    }
}