package com.scottlogic.hackathon.server.authentication;

import com.google.common.base.Optional;
import com.scottlogic.hackathon.server.services.TeamService;
import io.dropwizard.auth.AuthenticationException;
import io.dropwizard.auth.basic.BasicCredentials;

public class Authenticator implements io.dropwizard.auth.Authenticator<BasicCredentials, User> {
    private final TeamService teamService;

    public Authenticator(final TeamService teamService) {
        this.teamService = teamService;
    }

    @Override
    public Optional<User> authenticate(final BasicCredentials credentials) throws AuthenticationException {
        Optional<User> authenticatedUser = Optional.absent();

        if ("admin".equals(credentials.getUsername()) && "secret".equals(credentials.getPassword())) {
            authenticatedUser = Optional.of(new User(credentials.getUsername(), User.Role.ADMIN));
        } else if (teamService.authenticate(credentials)) {
            authenticatedUser = Optional.of(new User(credentials.getUsername(), User.Role.TEAM));
        }

        return authenticatedUser;
    }
}
