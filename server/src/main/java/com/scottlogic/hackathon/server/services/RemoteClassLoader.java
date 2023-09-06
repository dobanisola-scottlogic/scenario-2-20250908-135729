package com.scottlogic.hackathon.server.services;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.jar.JarEntry;
import java.util.jar.JarInputStream;
import com.google.common.io.ByteStreams;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class RemoteClassLoader extends ClassLoader {
  private final Logger logger;
  private final byte[] jarBytes;

  public RemoteClassLoader(final byte[] jarBytes) {
    this.jarBytes = jarBytes;
    logger = LoggerFactory.getLogger(this.getClass().getName());
  }

  @Override
  protected Class<?> findClass(final String name) throws ClassNotFoundException {
    return loadClassFromJar(name);
  }

  protected Class<?> loadClassFromJar(final String name) throws ClassNotFoundException {
    final InputStream inputStream = getResourceAsStream(name.replace('.', '/') + ".class");

    if (inputStream == null) {
      throw new ClassNotFoundException(String.format("Class %s not found in Jar", name));
    }
    byte[] bytes = null;
    try {
      bytes = ByteStreams.toByteArray(inputStream);
    } catch (final IOException e) {
      throw new RuntimeException("Couldn't load input stream", e);
    }

    return defineClass(name, bytes, 0, bytes.length);
  }

  @Override
  public InputStream getResourceAsStream(final String name) {
    InputStream inputStream = null;

    try (JarInputStream jarInputStream = new JarInputStream(new ByteArrayInputStream(jarBytes))) {
      JarEntry entry;
      while ((entry = jarInputStream.getNextJarEntry()) != null && inputStream == null) {
        if (entry.getName().equals(name)) {
          final ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
          final byte[] buffer = new byte[1024 * 8];
          int read;
          while ((read = jarInputStream.read(buffer, 0, buffer.length)) != -1) {
            outputStream.write(buffer, 0, read);
          }
          inputStream = new ByteArrayInputStream(outputStream.toByteArray());
        }

        jarInputStream.closeEntry();
      }
    } catch (final IOException e) {
      logger.error("Error parsing Jar file", e);
    }

    return inputStream;
  }
}
