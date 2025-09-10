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

### 4. Authentication Security
- Uses HTTP Basic Authentication
- Supports both admin and team authentication
- **New**: Constant-time password comparison to prevent timing attacks
- **Recommendation**: Deploy behind HTTPS to protect credentials in transit

### 5. Input Validation
- **Team Names**: Restricted to alphanumeric characters, spaces, hyphens, and underscores (max 50 chars)
- **Passwords**: Minimum 8 characters, must contain at least one letter and one number
- **SQL Injection Protection**: Uses parameterized queries throughout

### 6. Database Security
- All database operations use parameterized queries
- No direct SQL string concatenation
- Hibernate ORM provides additional protection layers

## Deployment Security Checklist

### Before Production Deployment

- [ ] Set `ADMIN_PASSWORD` environment variable to a strong, unique password
- [ ] Set `ALLOWED_ORIGINS` to restrict CORS to your specific domains
- [ ] Ensure the application is deployed behind HTTPS
- [ ] Review and configure firewall rules to restrict access
- [ ] Regularly update dependencies to patch security vulnerabilities
- [ ] Monitor application logs for suspicious activity
- [ ] Test authentication and authorization controls
- [ ] Verify security headers are properly set

### Password Requirements

For the admin password, use:
- Minimum 12 characters
- Mix of uppercase, lowercase, numbers, and special characters
- Avoid common passwords or dictionary words
- Consider using a password manager to generate and store the password

For team passwords (enforced by validation):
- Minimum 8 characters
- At least one letter and one number

### Network Security

- Deploy behind a reverse proxy (nginx, Apache) with HTTPS termination
- Use strong TLS configuration (TLS 1.2 minimum, prefer TLS 1.3)
- Implement rate limiting to prevent brute force attacks
- Consider IP whitelisting for admin access
- Configure appropriate firewall rules

## Security Vulnerabilities Fixed

### Critical Issues Resolved:
1. **Hardcoded Admin Password**: Now configurable via environment variable
2. **Insecure CORS**: Restricted to specific origins in production
3. **Timing Attacks**: Constant-time password comparison implemented
4. **Missing Security Headers**: Comprehensive security headers added
5. **Weak Input Validation**: Enhanced validation for team names and passwords

### Additional Protections Added:
- XSS prevention through Content Security Policy
- Clickjacking prevention through X-Frame-Options
- MIME sniffing prevention
- Input sanitization and validation
- Protection against common web vulnerabilities

## Security Updates

This application includes comprehensive security measures for a hackathon environment. For production use:
- Regularly update all dependencies
- Monitor security advisories for used libraries
- Implement proper logging and monitoring
- Consider additional security measures based on your threat model
- Perform regular security assessments

## Reporting Security Issues

If you discover a security vulnerability, please report it responsibly by contacting the development team privately before public disclosure.