package com.scottlogic.hackathon.server.authentication;

import com.google.common.base.Optional;
import io.dropwizard.auth.AuthenticationException;
import io.dropwizard.auth.basic.BasicCredentials;

public class Authenticator implements io.dropwizard.auth.Authenticator<BasicCredentials, User> {
    @Override
    public Optional<User> authenticate(final BasicCredentials credentials) throws AuthenticationException {
        Optional<User> authenticatedUser = Optional.absent();

        if ("secret".equals(credentials.getPassword())) {
            authenticatedUser = Optional.of(new User(credentials.getUsername()));
        }

        return authenticatedUser;
    }
}
