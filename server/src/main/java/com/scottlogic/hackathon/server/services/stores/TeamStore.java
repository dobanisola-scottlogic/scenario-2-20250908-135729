package com.scottlogic.hackathon.server.services.stores;

import com.scottlogic.hackathon.server.database.DataAccessor;
import com.scottlogic.hackathon.server.database.Database;
import com.scottlogic.hackathon.server.models.Team;
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

public class TeamStore {
    private final Logger logger;

    public TeamStore() {
        logger = LoggerFactory.getLogger(this.getClass().getName());
    }

    public Team saveTeam(final Team team) {
        Database database = null;
        Team savedTeam = null;

        try {
            database = new Database();
            final Transaction transaction = database.beginTransaction();
            final DataAccessor dataAccessor = new DataAccessor(database.getEntityStore());
            dataAccessor.teamById.put(transaction, team);
            transaction.commit();
            savedTeam = team;
        } catch (final Exception ex) {
            logger.error("Error saving team to database", ex);
        } finally {
            if (database != null) {
                database.close();
            }
        }

        return savedTeam;
    }

    public Team getTeam(final UUID id) {
        return Database.accessDatabase(dataAccessor -> dataAccessor.teamById.get(id.toString()),
                ex -> logger.error("Error getting team from database", ex));
    }

    public Team getTeam(final String name) {
        return Database.accessDatabase(dataAccessor -> dataAccessor.teamByName.get(name),
                ex -> logger.error("Error getting team by name from database", ex));
    }

    public List<Team> getTeams() {
        List<Team> teamResults = Database.accessDatabase(dataAccessor -> {
                    final EntityCursor<Team> items = dataAccessor.teamById.entities();

                    final List<Team> teamItems = StreamSupport.stream(items.spliterator(), false)
                            .collect(Collectors.toList());
                    items.close();
                    return teamItems;
                },
                ex -> logger.error("Error retrieving teams from database", ex));

        if (teamResults == null) {
            teamResults = new ArrayList<>();
        }

        return Collections.unmodifiableList(teamResults);
    }

    public boolean deleteTeam(final UUID id) {
        return Database.accessDatabase(dataAccessor -> dataAccessor.teamById.delete(id.toString()),
                ex -> logger.error("Error deleting team from database", ex));
    }

    public List<Team> getTeamsByHackathon(final UUID hackathonId) {
        List<Team> teams = Database.accessDatabase(dataAccessor -> {
                    final EntityCursor<Team> items = dataAccessor.teamsByHackathonId.subIndex(hackathonId.toString()).entities();

                    final List<Team> teamIds = StreamSupport.stream(items.spliterator(), false)
                            .collect(Collectors.toList());
                    items.close();
                    return teamIds;
                },
                ex -> logger.error("Error retrieving teams from database for hackathon", ex));

        if (teams == null) {
            teams = new ArrayList<>();
        }

        return Collections.unmodifiableList(teams);
    }

    public Team update(final UUID id, final TeamUpdate update) {
        Team team = getTeam(id);
        if (team != null) {
            if (update.getName() != null) {
                team.setName(update.getName());
            }

            if (update.getPassword() != null) {
                team.setPassword(update.getPassword());
            }

            team = saveTeam(team);
        }

        return team;
    }
}
