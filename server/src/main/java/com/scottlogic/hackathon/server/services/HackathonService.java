package com.scottlogic.hackathon.server.services;

import com.google.inject.Inject;
import com.scottlogic.hackathon.server.authentication.User;
import com.scottlogic.hackathon.server.models.Hackathon;
import com.scottlogic.hackathon.server.services.stores.HackathonStore;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.List;
import java.util.UUID;

public class HackathonService {
    private final Logger logger;
    private final HackathonStore hackathonStore;

    @Inject
    public HackathonService(
            final HackathonStore hackathonStore) {
        logger = LoggerFactory.getLogger(this.getClass().getName());
        this.hackathonStore = hackathonStore;
    }

    public Hackathon createHackathon(final User user, final Hackathon hackathon) {
        return hackathonStore.addHackathon(new Hackathon(hackathon.getName()));
    }

    public List<Hackathon> getHackathons() {
        return hackathonStore.getHackathons();
    }

    public Hackathon getHackathon(final UUID id) {
        return hackathonStore.getHackathon(id);
    }

    public boolean deleteHackathon(final UUID id) {
        return hackathonStore.deleteHackathon(id);
    }

}
