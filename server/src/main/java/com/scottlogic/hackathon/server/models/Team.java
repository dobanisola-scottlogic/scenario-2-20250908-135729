package com.scottlogic.hackathon.server.models;

import com.sleepycat.persist.model.Entity;
import com.sleepycat.persist.model.PrimaryKey;
import com.sleepycat.persist.model.Relationship;
import com.sleepycat.persist.model.SecondaryKey;
import io.dropwizard.auth.basic.BasicCredentials;

import javax.validation.constraints.NotNull;
import java.util.UUID;

@Entity
public class Team {
    @PrimaryKey
    private String key;
    private UUID id;

    @SecondaryKey(relate = Relationship.ONE_TO_ONE)
    @NotNull
    private String name;
    private String password;

    public UUID getId() {
        return id;
    }

    public void setId(final UUID id) {
        this.id = id;
        this.key = id.toString();
    }

    public String getName() {
        return name;
    }

    public void setName(final String name) {
        this.name = name;
    }

    public void setPassword(final String password) {
        this.password = password;
    }

    public boolean authenticate(final BasicCredentials credentials) {
        return credentials.getUsername().equals(name) && credentials.getPassword().equals(password);
    }
}
