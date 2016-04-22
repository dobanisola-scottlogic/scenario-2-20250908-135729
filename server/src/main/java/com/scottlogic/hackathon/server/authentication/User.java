package com.scottlogic.hackathon.server.authentication;

import java.security.Principal;

public class User implements Principal {
    private final String name;

    public User(final String name) {
        this.name = name;
    }

    public String getName() {
        return name;
    }
}
