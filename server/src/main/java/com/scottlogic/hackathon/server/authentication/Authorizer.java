package com.scottlogic.hackathon.server.authentication;

public class Authorizer implements io.dropwizard.auth.Authorizer<User> {
    public final static String ROLE_ADMIN = "ADMIN";
    public final static String ROLE_TEAM = "TEAM";

    @Override
    public boolean authorize(final User user, final String role) {
        boolean authorized = false;

        if (role.equals(ROLE_ADMIN)) {
            authorized = user.getRole() == User.Role.ADMIN;
        } else if (role.equals(ROLE_TEAM)) {
            authorized = user.getRole() == User.Role.TEAM;
        }

        return authorized;
    }
}
