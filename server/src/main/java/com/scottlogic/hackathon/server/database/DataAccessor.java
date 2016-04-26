package com.scottlogic.hackathon.server.database;

import com.scottlogic.hackathon.server.models.GameResult;
import com.scottlogic.hackathon.server.models.Team;
import com.scottlogic.hackathon.server.models.UploadedBot;
import com.sleepycat.je.DatabaseException;
import com.sleepycat.persist.EntityStore;
import com.sleepycat.persist.PrimaryIndex;
import com.sleepycat.persist.SecondaryIndex;

public class DataAccessor {
    public PrimaryIndex<String, GameResult> gameResultById;
    public PrimaryIndex<String, Team> teamById;
    public SecondaryIndex<String, String, Team> teamByName;

    public PrimaryIndex<String, UploadedBot> botById;
    public SecondaryIndex<String, String, UploadedBot> botByTeamId;

    public DataAccessor(final EntityStore store) throws DatabaseException {
        gameResultById = store.getPrimaryIndex(String.class, GameResult.class);

        teamById = store.getPrimaryIndex(String.class, Team.class);
        teamByName = store.getSecondaryIndex(teamById, String.class, "name");

        botById = store.getPrimaryIndex(String.class, UploadedBot.class);
        botByTeamId = store.getSecondaryIndex(botById, String.class, "teamId");
    }
}