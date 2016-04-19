package com.scottlogic.hackathon.server.services.stores;


import com.scottlogic.hackathon.server.database.DataAccessor;
import com.scottlogic.hackathon.server.database.Database;
import com.scottlogic.hackathon.server.models.GameResult;
import com.sleepycat.persist.EntityCursor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

public class GameStore {
    private final Logger logger;

    GameStore() {
        logger = LoggerFactory.getLogger(this.getClass().getName());
    }

    public void addGameResult(final GameResult gameResult) {
        Database database = null;

        try {
            database = new Database();
            final DataAccessor dataAccessor = new DataAccessor(database.getEntityStore());
            dataAccessor.gameResultById.put(gameResult);
        } catch (final Exception ex) {
            logger.error("Error adding game result to database", ex);
        } finally {
            if (database != null) {
                database.close();
            }
        }
    }

    public GameResult getGameResult(final UUID id) {
        GameResult gameResult = null;

        Database database = null;
        try {
            database = new Database();
            final DataAccessor dataAccessor = new DataAccessor(database.getEntityStore());
            gameResult = dataAccessor.gameResultById.get(id.toString());
        } catch (final Exception ex) {
            logger.error("Error getting game result from database", ex);
        } finally {
            if (database != null) {
                database.close();
            }
        }

        return gameResult;
    }

    public List<UUID> getGameResults() {
        Database database = null;
        List<UUID> gameResults = new ArrayList<UUID>();

        try {
            database = new Database();
            final DataAccessor dataAccessor = new DataAccessor(database.getEntityStore());
            final EntityCursor<GameResult> items = dataAccessor.gameResultById.entities();

            gameResults = StreamSupport.stream(items.spliterator(), false)
                    .map(item -> item.getId())
                    .collect(Collectors.toList());
            items.close();
        } catch (final Exception ex) {
            logger.error("Error retrieving game results from database", ex);
        } finally {
            if (database != null) {
                database.close();
            }
        }

        return Collections.unmodifiableList(gameResults);
    }
}