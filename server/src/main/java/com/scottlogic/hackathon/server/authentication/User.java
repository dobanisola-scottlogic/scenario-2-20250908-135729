package com.scottlogic.hackathon.server.authentication;

import java.security.Principal;

public class User implements Principal {
    private final String name;
    private final Role role;

    public User(final String name, final Role role) {
        this.name = name;
        this.role = role;
    }

    public String getName() {
        return name;
    }

    public Role getRole() {
        return role;
    }

    public enum Role {
        ADMIN,
        TEAM
    }
}
