package com.scottlogic.hackathon.server.services.stores;

import com.scottlogic.hackathon.server.database.Database;
import com.scottlogic.hackathon.server.models.Hackathon;
import com.sleepycat.persist.EntityCursor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

public class HackathonStore {
    private final Logger logger;

    HackathonStore() {
        logger = LoggerFactory.getLogger(this.getClass().getName());
    }

    public Hackathon addHackathon(final Hackathon hackathon) {
        Database.accessDatabase(dataAccessor -> dataAccessor.hackathonById.put(hackathon),
                ex -> logger.error("Error adding hackathon to database", ex));
        return hackathon;
    }

    public Hackathon getHackathon(final UUID id) {
        return Database.accessDatabase(dataAccessor -> dataAccessor.hackathonById.get(id.toString()),
                ex -> logger.error("Error getting hackathon from database", ex));
    }

    public List<Hackathon> getHackathons() {
        List<Hackathon> hackathons = Database.accessDatabase(dataAccessor -> {
                    final EntityCursor<Hackathon> items = dataAccessor.hackathonById.entities();

                    final List<Hackathon> hackathonIds = StreamSupport.stream(items.spliterator(), false)
                            .collect(Collectors.toList());
                    items.close();
                    return hackathonIds;
                },
                ex -> logger.error("Error retrieving hackathons from database", ex));

        if (hackathons == null) {
            hackathons = new ArrayList<>();
        }

        return Collections.unmodifiableList(hackathons);
    }

    public boolean deleteHackathon(final UUID id) {
        return Database.accessDatabase(dataAccessor -> dataAccessor.hackathonById.delete(id.toString()),
                ex -> logger.error("Error deleting hackathon from database", ex));
    }
}
