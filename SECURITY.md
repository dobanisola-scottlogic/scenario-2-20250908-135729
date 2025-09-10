# Security Configuration Guide

This document outlines the security measures implemented in the hackathon game server and provides guidance for secure deployment.

## Environment Variables for Security

### Required for Production

- `ADMIN_PASSWORD`: Set a strong password for the admin user. If not set, defaults to "secret" (insecure for production)
- `ALLOWED_ORIGINS`: Comma-separated list of allowed origins for CORS (e.g., "https://yourdomain.com,https://app.yourdomain.com")

### Optional Security Configuration

- `ENVIRONMENT`: Set to "dev" for development environment (enables more permissive CORS)

## Security Features Implemented

### 1. Configurable Admin Password
- Admin password is now configurable via `ADMIN_PASSWORD` environment variable
- Falls back to default "secret" only for development environments
- **Important**: Always set `ADMIN_PASSWORD` in production deployments

### 2. Secure CORS Configuration
- Production: Restrictive CORS policy with configurable allowed origins
- Development: Permissive policy for localhost development
- Credentials are allowed only from specified origins

### 3. Security Headers
The application automatically adds the following security headers:
- `X-Frame-Options: DENY` - Prevents clickjacking attacks
- `X-Content-Type-Options: nosniff` - Prevents MIME type sniffing
- `X-XSS-Protection: 1; mode=block` - Enables browser XSS protection
- `Content-Security-Policy` - Prevents XSS and code injection attacks
- `Referrer-Policy: strict-origin-when-cross-origin` - Controls referrer information
- `Permissions-Policy` - Restricts access to sensitive browser features

### 4. Authentication
- Uses HTTP Basic Authentication
- Supports both admin and team authentication
- **Recommendation**: Deploy behind HTTPS to protect credentials in transit

## Deployment Security Checklist

### Before Production Deployment

- [ ] Set `ADMIN_PASSWORD` environment variable to a strong, unique password
- [ ] Set `ALLOWED_ORIGINS` to restrict CORS to your specific domains
- [ ] Ensure the application is deployed behind HTTPS
- [ ] Review and configure firewall rules to restrict access
- [ ] Regularly update dependencies to patch security vulnerabilities
- [ ] Monitor application logs for suspicious activity

### Password Requirements

For the admin password, use:
- Minimum 12 characters
- Mix of uppercase, lowercase, numbers, and special characters
- Avoid common passwords or dictionary words
- Consider using a password manager to generate and store the password

### Network Security

- Deploy behind a reverse proxy (nginx, Apache) with HTTPS termination
- Use strong TLS configuration (TLS 1.2 minimum, prefer TLS 1.3)
- Implement rate limiting to prevent brute force attacks
- Consider IP whitelisting for admin access

## Security Updates

This application includes basic security measures. For production use:
- Regularly update all dependencies
- Monitor security advisories for used libraries
- Implement proper logging and monitoring
- Consider additional security measures based on your threat model

## Reporting Security Issues

If you discover a security vulnerability, please report it responsibly by contacting the development team privately before public disclosure.