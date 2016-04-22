package com.scottlogic.hackathon.server.services.stores;


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
        Database.accessDatabase(dataAccessor -> dataAccessor.gameResultById.put(gameResult),
                ex -> logger.error("Error adding game result to database", ex));
    }

    public GameResult getGameResult(final UUID id) {
        return Database.accessDatabase(dataAccessor -> dataAccessor.gameResultById.get(id.toString()),
                ex -> logger.error("Error getting game result from database", ex));
    }

    public List<UUID> getGameResults() {
        List<UUID> gameResults = Database.accessDatabase(dataAccessor -> {
                    final EntityCursor<GameResult> items = dataAccessor.gameResultById.entities();

                    final List<UUID> gameResultsIds = StreamSupport.stream(items.spliterator(), false)
                            .map(item -> item.getId())
                            .collect(Collectors.toList());
                    items.close();
                    return gameResultsIds;
                },
                ex -> logger.error("Error retrieving game results from database", ex));

        if (gameResults == null) {
            gameResults = new ArrayList<>();
        }

        return Collections.unmodifiableList(gameResults);
    }
}