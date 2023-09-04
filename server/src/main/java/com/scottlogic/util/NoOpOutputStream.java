package com.scottlogic.util;

import java.io.OutputStream;

/**
 * A short-circuiting no-op implementation of {@linkplain OutputStream}. Generally, the {@linkplain
 * #SINGLETON singleton} instance should be all that's required.
 */
public final class NoOpOutputStream extends OutputStream {

  /** Global singleton instance of {@linkplain NoOpPrintStream} */
  public static final NoOpOutputStream SINGLETON = new NoOpOutputStream();

  /**
   * Constructor for NoOpOutputStream. Use this if you need multiple instances that are not
   * {@linkplain Object#equals(Object) equal}. Otherwise, just use the {@linkplain #SINGLETON
   * singleton}.
   */
  private NoOpOutputStream() {}

  @Override
  public void write(int b) {}

  @Override
  public void write(byte[] b) {}

  @Override
  public void write(byte[] b, int off, int len) {}
}
