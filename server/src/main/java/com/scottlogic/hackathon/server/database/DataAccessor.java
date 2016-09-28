package com.scottlogic.hackathon.server.database;

import com.scottlogic.hackathon.server.services.stores.ActiveBot;
import com.scottlogic.hackathon.server.models.Hackathon;
import com.scottlogic.hackathon.server.models.GameResult;
import com.scottlogic.hackathon.server.models.Team;
import com.scottlogic.hackathon.server.models.UploadedBot;
import com.sleepycat.je.DatabaseException;
import com.sleepycat.persist.EntityStore;
import com.sleepycat.persist.PrimaryIndex;
import com.sleepycat.persist.SecondaryIndex;

public class DataAccessor {
    public PrimaryIndex<String, Hackathon> hackathonById;

    public PrimaryIndex<String, GameResult> gameResultById;
    public SecondaryIndex<String, String, GameResult> gameResultByHackathonId;

    public PrimaryIndex<String, Team> teamById;
    public SecondaryIndex<String, String, Team> teamByName;
    public SecondaryIndex<String, String, Team> teamsByHackathonId;

    public PrimaryIndex<String, UploadedBot> botById;
    public SecondaryIndex<String, String, UploadedBot> botByTeamId;

    public PrimaryIndex<String, ActiveBot> activeBotByTeamId;

    public DataAccessor(final EntityStore store) throws DatabaseException {
        hackathonById = store.getPrimaryIndex(String.class, Hackathon.class);

        gameResultById = store.getPrimaryIndex(String.class, GameResult.class);
        gameResultByHackathonId = store.getSecondaryIndex(gameResultById, String.class, "hackathonKey");

        teamById = store.getPrimaryIndex(String.class, Team.class);
        teamByName = store.getSecondaryIndex(teamById, String.class, "name");
        teamsByHackathonId = store.getSecondaryIndex(teamById, String.class, "hackathonKey");

        botById = store.getPrimaryIndex(String.class, UploadedBot.class);
        botByTeamId = store.getSecondaryIndex(botById, String.class, "teamId");

        activeBotByTeamId = store.getPrimaryIndex(String.class, ActiveBot.class);
    }
}