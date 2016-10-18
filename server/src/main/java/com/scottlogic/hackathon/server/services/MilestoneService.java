package com.scottlogic.hackathon.server.services;

import com.google.inject.Inject;
import com.scottlogic.hackathon.server.models.MilestoneBot;
import com.scottlogic.hackathon.server.services.stores.MilestoneStore;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.List;
import java.util.UUID;

public class MilestoneService {
    private final Logger logger;
    private final MilestoneStore milestoneStore;

    @Inject
    public MilestoneService(final MilestoneStore milestoneStore) {
        logger = LoggerFactory.getLogger(this.getClass().getName());
        this.milestoneStore = milestoneStore;
    }

    public void addMilestone(final MilestoneBot milestoneBot) {
        milestoneStore.saveOrUpdate(milestoneBot);
    }

    public List<MilestoneBot> getMilestones() {
        return milestoneStore.list();
    }

    public boolean deleteMilestone(final UUID id) {
        return milestoneStore.delete(id);
    }

}
