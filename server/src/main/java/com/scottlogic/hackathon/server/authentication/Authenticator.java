package com.scottlogic.hackathon.server.authentication;

import com.google.common.base.Optional;
import com.scottlogic.hackathon.server.services.AdminService;
import com.scottlogic.hackathon.server.services.TeamService;
import io.dropwizard.auth.AuthenticationException;
import io.dropwizard.auth.basic.BasicCredentials;
import io.dropwizard.hibernate.UnitOfWork;

public class Authenticator implements io.dropwizard.auth.Authenticator<BasicCredentials, User> {
    private final TeamService teamService;
    private final AdminService adminService;

    public Authenticator(final TeamService teamService, final AdminService adminService) {
        this.teamService = teamService;
        this.adminService = adminService;
    }

    @Override
    @UnitOfWork
    public Optional<User> authenticate(final BasicCredentials credentials) throws AuthenticationException {
        Optional<User> authenticatedUser = Optional.absent();

        String adminPassword = adminService.getAdmin().getPassword();

        if ("admin".equals(credentials.getUsername()) && adminPassword.equals(credentials.getPassword())) {
            authenticatedUser = Optional.of(new User(credentials.getUsername(), User.Role.ADMIN));
        } else if (teamService.authenticate(credentials)) {
            authenticatedUser = Optional.of(new User(credentials.getUsername(), User.Role.TEAM));
        }

        return authenticatedUser;
    }
}
