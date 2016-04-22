package com.scottlogic.hackathon.server.authentication;

public class Authorizer implements io.dropwizard.auth.Authorizer<User> {
    @Override
    public boolean authorize(final User user, final String role) {
        boolean authorized = false;

        if (role.equals("ADMIN")) {
            authorized = user.getName().equals("admin");
        }

        return authorized;
    }
}
