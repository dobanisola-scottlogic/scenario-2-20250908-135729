package com.scottlogic.hackathon.server.services.stores;

import com.scottlogic.hackathon.server.database.Database;
import com.scottlogic.hackathon.server.models.Team;
import com.scottlogic.hackathon.server.models.UploadedBot;
import com.sleepycat.persist.EntityCursor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

public class BotStore {
    private final Logger logger;

    public BotStore() {
        logger = LoggerFactory.getLogger(this.getClass().getName());
    }

    public UploadedBot saveBot(final UploadedBot uploadedBot) {
        return Database.accessDatabase(dataAccessor -> {
                    dataAccessor.botById.put(uploadedBot);
                    return uploadedBot;
                },
                ex -> logger.error("Error saving Bot to database", ex));
    }

    public UploadedBot getBot(final UUID id) {
        return Database.accessDatabase(dataAccessor -> dataAccessor.botById.get(id.toString()),
                ex -> logger.error("Error getting Bot from database", ex));
    }

    public UploadedBot getBot(final Team team) {
        return Database.accessDatabase(dataAccessor -> dataAccessor.botByTeamId.get(team.getId().toString()),
                ex -> logger.error("Error getting Bot from database", ex));
    }

    public List<UploadedBot> getUploadedBots() {
        List<UploadedBot> uploadedBotsResults = Database.accessDatabase(dataAccessor -> {
                    final EntityCursor<UploadedBot> items = dataAccessor.botById.entities();

                    final List<UploadedBot> teamItems = StreamSupport.stream(items.spliterator(), false)
                            .collect(Collectors.toList());
                    items.close();
                    return teamItems;
                },
                ex -> logger.error("Error retrieving uploaded bots from database", ex));

        if (uploadedBotsResults == null) {
            uploadedBotsResults = new ArrayList<>();
        }

        return Collections.unmodifiableList(uploadedBotsResults);
    }

    public List<UploadedBot> getUploadedBots(final Team team) {
        List<UploadedBot> uploadedBotsResults = Database.accessDatabase(dataAccessor -> {
                    final EntityCursor<UploadedBot> items = dataAccessor.botByTeamId.subIndex(team.getId().toString()).entities();

                    final List<UploadedBot> teamItems = StreamSupport.stream(items.spliterator(), false)
                            .collect(Collectors.toList());
                    items.close();
                    return teamItems;
                },
                ex -> logger.error("Error retrieving uploaded bots from database", ex));

        if (uploadedBotsResults == null) {
            uploadedBotsResults = new ArrayList<>();
        }

        return Collections.unmodifiableList(uploadedBotsResults);
    }

    public boolean deleteUploadedBot(final UUID id) {
        return Database.accessDatabase(dataAccessor -> dataAccessor.botById.delete(id.toString()),
                ex -> logger.error("Error getting bot from database", ex));
    }
}
