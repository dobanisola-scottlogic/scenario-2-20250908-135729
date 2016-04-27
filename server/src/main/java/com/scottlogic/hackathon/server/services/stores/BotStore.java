package com.scottlogic.hackathon.server.services.stores;

import com.scottlogic.hackathon.server.database.DataAccessor;
import com.scottlogic.hackathon.server.database.Database;
import com.scottlogic.hackathon.server.models.Team;
import com.scottlogic.hackathon.server.models.UploadedBot;
import com.sleepycat.je.Transaction;
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

    public List<UploadedBot> getActiveBots() {
        List<UploadedBot> activeBotsResults = Database.accessDatabase(dataAccessor -> {
            final EntityCursor<ActiveBot> items = dataAccessor.activeBotByTeamId.entities();

            final List<UploadedBot> activeBots = StreamSupport.stream(items.spliterator(), false)
                    .map(activeBot -> getBot(activeBot.getBotId()))
                    .collect(Collectors.toList());

            items.close();
            return activeBots;
        }, ex -> logger.error("Error retrieving active bots from database", ex));

        if (activeBotsResults == null) {
            activeBotsResults = new ArrayList<>();
        }

        return Collections.unmodifiableList(activeBotsResults);
    }

    public ActiveBot setActiveBot(final UploadedBot uploadedBot) {
        Database database = null;
        ActiveBot activeBot = new ActiveBot(uploadedBot);

        try {
            database = new Database();
            final Transaction transaction = database.beginTransaction();
            final DataAccessor dataAccessor = new DataAccessor(database.getEntityStore());

            dataAccessor.activeBotByTeamId.delete(transaction, uploadedBot.getTeamId().toString());
            dataAccessor.activeBotByTeamId.put(transaction, activeBot);

            transaction.commit();
        } catch (final Exception ex) {
            logger.error("Error saving active bot to database", ex);
            activeBot = null;
        } finally {
            if (database != null) {
                database.close();
            }
        }

        return activeBot;
    }
}
