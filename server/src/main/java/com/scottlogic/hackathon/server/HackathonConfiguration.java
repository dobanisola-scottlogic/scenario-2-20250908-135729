package com.scottlogic.hackathon.server;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.scottlogic.hackathon.bots.*;
import com.scottlogic.hackathon.server.models.MilestoneBot;
import io.dropwizard.Configuration;
import io.dropwizard.db.DataSourceFactory;
import org.hibernate.validator.constraints.NotEmpty;

import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import java.util.ArrayList;
import java.util.List;

public class HackathonConfiguration extends Configuration {
    @Valid
    @NotNull
    private DataSourceFactory database = new DataSourceFactory();

    @NotEmpty
    private String name = "Code Challenge";

    @JsonProperty("database")
    public void setDataSourceFactory(final DataSourceFactory factory) {
        this.database = factory;
    }

    @JsonProperty("database")
    public DataSourceFactory getDataSourceFactory() {
        return database;
    }

    @JsonProperty
    public String getName() {
        return name;
    }

    @JsonProperty
    public void setName(final String name) {
        this.name = name;
    }

    public List<MilestoneBot> getMilestoneBots() {
        List<MilestoneBot> milestoneBots = new ArrayList<>();
        milestoneBots.add(new MilestoneBot(new DefaultBot()));
        milestoneBots.add(new MilestoneBot(new Milestone1Bot()));
        milestoneBots.add(new MilestoneBot(new Milestone2Bot()));
        milestoneBots.add(new MilestoneBot(new Milestone3Bot()));
        milestoneBots.add(new MilestoneBot(new FastExpansionBot()));
        return milestoneBots;
    }
}