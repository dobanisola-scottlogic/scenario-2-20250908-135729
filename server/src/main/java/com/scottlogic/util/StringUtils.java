package com.scottlogic.util;

public class StringUtils {
  private StringUtils() {
    throw new IllegalStateException("Utility class not for instantiation");
  }

  /**
   * Returns {@code true} if the string is null or empty or contains only
   * {@linkplain Character#isWhitespace(int) white space} codepoints,
   * otherwise {@code false}.
   *
   * @return {@code true} if the string is empty or contains only
   *         {@linkplain Character#isWhitespace(int) white space} codepoints,
   *         otherwise {@code false}
   *
   * @see Character#isWhitespace(int)
   */
  public static boolean isNullOrBlank(String string) {
    return string == null || string.isBlank();
  }

  /**
   * Returns {@code true} if the string is null or if {@link #length()} is
   * {@code 0}.
   *
   * @return {@code true} if the string is null or if {@link #length()} is
   *         {@code 0}, otherwise {@code false}
   *
   * @since 1.6
   */
  public static boolean isNullOrEmpty(String string) {
    return string == null || string.isEmpty();
  }
}
