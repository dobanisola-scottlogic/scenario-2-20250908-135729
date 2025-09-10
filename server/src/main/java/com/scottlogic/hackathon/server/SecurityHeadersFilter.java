package com.scottlogic.hackathon.server;

import java.io.IOException;
import jakarta.servlet.Filter;
import jakarta.servlet.FilterChain;
import jakarta.servlet.FilterConfig;
import jakarta.servlet.ServletException;
import jakarta.servlet.ServletRequest;
import jakarta.servlet.ServletResponse;
import jakarta.servlet.http.HttpServletResponse;

/**
 * Filter to add security headers to HTTP responses
 */
public class SecurityHeadersFilter implements Filter {

  @Override
  public void init(FilterConfig filterConfig) throws ServletException {
    // No initialization needed
  }

  @Override
  public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
      throws IOException, ServletException {
    
    if (response instanceof HttpServletResponse) {
      HttpServletResponse httpResponse = (HttpServletResponse) response;
      
      // Prevent clickjacking attacks
      httpResponse.setHeader("X-Frame-Options", "DENY");
      
      // Prevent MIME type sniffing
      httpResponse.setHeader("X-Content-Type-Options", "nosniff");
      
      // Enable XSS protection in browsers
      httpResponse.setHeader("X-XSS-Protection", "1; mode=block");
      
      // Content Security Policy to prevent XSS attacks
      httpResponse.setHeader("Content-Security-Policy", 
        "default-src 'self'; " +
        "script-src 'self' 'unsafe-inline' 'unsafe-eval'; " +
        "style-src 'self' 'unsafe-inline'; " +
        "img-src 'self' data:; " +
        "font-src 'self'; " +
        "connect-src 'self'; " +
        "frame-ancestors 'none';"
      );
      
      // Referrer Policy
      httpResponse.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
      
      // Permissions Policy (formerly Feature Policy)
      httpResponse.setHeader("Permissions-Policy", 
        "camera=(), microphone=(), geolocation=(), payment=()"
      );
    }
    
    chain.doFilter(request, response);
  }

  @Override
  public void destroy() {
    // No cleanup needed
  }
}