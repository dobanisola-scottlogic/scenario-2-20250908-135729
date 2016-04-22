package com.scottlogic.hackathon.server.database;

import com.scottlogic.hackathon.server.models.GameResult;
import com.scottlogic.hackathon.server.models.Team;
import com.sleepycat.je.DatabaseException;
import com.sleepycat.persist.EntityStore;
import com.sleepycat.persist.PrimaryIndex;

public class DataAccessor {
    public PrimaryIndex<String, GameResult> gameResultById;
    public PrimaryIndex<String, Team> teamById;

    public DataAccessor(final EntityStore store) throws DatabaseException {
        gameResultById = store.getPrimaryIndex(String.class, GameResult.class);
        teamById = store.getPrimaryIndex(String.class, Team.class);
    }
}