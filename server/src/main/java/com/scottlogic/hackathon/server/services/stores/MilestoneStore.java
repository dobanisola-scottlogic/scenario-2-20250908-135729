package com.scottlogic.hackathon.server.services.stores;

import com.scottlogic.hackathon.server.database.Database;
import com.scottlogic.hackathon.server.models.MilestoneBot;
import com.sleepycat.persist.EntityCursor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

public class MilestoneStore {
    private final Logger logger;

    public MilestoneStore() {
        logger = LoggerFactory.getLogger(this.getClass().getName());
    }

    public MilestoneBot saveMilestone(final MilestoneBot milestoneBot) {
        return Database.accessDatabase(dataAccessor -> {
                    dataAccessor.milestoneById.put(milestoneBot);
                    return milestoneBot;
                },
                ex -> logger.error("Error saving Milestone to database", ex));
    }

    public MilestoneBot getMilestone(final UUID id) {
        return Database.accessDatabase(dataAccessor -> dataAccessor.milestoneById.get(id.toString()),
                ex -> logger.error("Error getting Milestone from database", ex));
    }

    public List<MilestoneBot> getMilestones() {
        List<MilestoneBot> milestoneResults = Database.accessDatabase(dataAccessor -> {
                    final EntityCursor<MilestoneBot> items = dataAccessor.milestoneById.entities();

                    final List<MilestoneBot> itemsList = StreamSupport.stream(items.spliterator(), false)
                            .collect(Collectors.toList());
                    items.close();
                    return itemsList;
                },
                ex -> logger.error("Error retrieving uploaded milestones from database", ex));

        if (milestoneResults == null) {
            milestoneResults = new ArrayList<>();
        }

        return Collections.unmodifiableList(milestoneResults);
    }

    public boolean deleteMilestone(final UUID id) {
        return Database.accessDatabase(dataAccessor -> dataAccessor.milestoneById.delete(id.toString()),
                ex -> logger.error("Error deleting milestone from database", ex));
    }

}
