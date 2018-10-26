package com.scottlogic.hackathon.server.models;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.google.common.io.ByteStreams;

import javax.persistence.ElementCollection;
import javax.persistence.Entity;
import javax.persistence.Id;
import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.Map;
import java.util.Set;
import java.util.UUID;

@Entity
public class UploadedJar {
    @Id
    private UUID id;
    private byte[] data;
    @ElementCollection
    private Set<String> contestantBots;

    @ElementCollection
    private Map<String, String> messageLookup;

    public UploadedJar() {
    }

    public UploadedJar(final InputStream inputStream) {
        setId(UUID.randomUUID());
        setData(inputStream);
    }

    public UUID getId() {
        return id;
    }

    public void setId(final UUID id) {
        this.id = id;
    }

    public void setData(final InputStream inputStream) {
        try {
            this.data = ByteStreams.toByteArray(inputStream);
        } catch (final IOException e) {
            e.printStackTrace();
        }
    }

    @JsonIgnore
    public InputStream getInputStream() {
        return new ByteArrayInputStream(data);
    }

    @JsonIgnore
    public byte[] getData() {
        return data;
    }

    public Set<String> getContestantBots() {
        return contestantBots;
    }

    public void setContestantBots(final Set contestantBots) {
        this.contestantBots = contestantBots;
    }

    public void setMessageLookup(Map<String, String> messageLookup) {
        this.messageLookup = messageLookup;
    }

    public Map<String, String> getMessageLookup() {
        return messageLookup;
    }
}
