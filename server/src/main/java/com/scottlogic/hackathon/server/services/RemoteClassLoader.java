package com.scottlogic.hackathon.server.services;

import com.google.common.io.ByteStreams;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.net.URL;
import java.util.jar.JarEntry;
import java.util.jar.JarInputStream;

public class RemoteClassLoader extends ClassLoader {
    private final Logger logger;
    private byte[] jarBytes;

    public RemoteClassLoader() {
        logger = LoggerFactory.getLogger(this.getClass().getName());
    }

    public Class<?> loadClass(final String name, final byte[] jarBytes, final boolean resolve) throws ClassNotFoundException {
        this.jarBytes = jarBytes;
        Class<?> clazz = findLoadedClass(name);
        if (clazz == null) {
            try {
                final InputStream inputStream = getResourceAsStream(name.replace('.', '/') + ".class");
                final byte[] bytes = ByteStreams.toByteArray(inputStream);

                clazz = defineClass(name, bytes, 0, bytes.length);
                if (resolve) {
                    resolveClass(clazz);
                }
            } catch (final Exception e) {
                clazz = super.loadClass(name, resolve);
            }
        }

        return clazz;
    }

    @Override
    public URL getResource(final String name) {
        return null;
    }

    @Override
    public InputStream getResourceAsStream(final String name) {
        InputStream resultInputStream = null;

        try (JarInputStream jarInputStream = new JarInputStream(new ByteArrayInputStream(jarBytes))) {
            JarEntry entry;
            while ((entry = jarInputStream.getNextJarEntry()) != null) {
                if (entry.getName().equals(name)) {
                    resultInputStream = jarInputStream;
                }
            }
        } catch (final IOException ex) {
            logger.error("Error parsing Jar file", ex);
        }

        return resultInputStream;
    }
}