package com.scottlogic.hackathon.server.database;

import com.scottlogic.hackathon.server.models.GameResult;
import com.sleepycat.je.DatabaseException;
import com.sleepycat.persist.EntityStore;
import com.sleepycat.persist.PrimaryIndex;

public class DataAccessor {
    public PrimaryIndex<String, GameResult> gameResultById;

    public DataAccessor(final EntityStore store) throws DatabaseException {
        gameResultById = store.getPrimaryIndex(String.class, GameResult.class);
    }
}