package com.scottlogic.hackathon.server.database;


import com.sleepycat.persist.model.Persistent;
import com.sleepycat.persist.model.PersistentProxy;

import java.util.UUID;

@Persistent(proxyFor = UUID.class)
public class UUIDProxy implements PersistentProxy<UUID> {
    private long mostSignificantBits;
    private long leastSignificantBits;

    private UUIDProxy() {
    }

    public void initializeProxy(final UUID obj) {
        mostSignificantBits = obj.getMostSignificantBits();
        leastSignificantBits = obj.getLeastSignificantBits();
    }

    public UUID convertProxy() {
        return new UUID(mostSignificantBits, leastSignificantBits);
    }
}