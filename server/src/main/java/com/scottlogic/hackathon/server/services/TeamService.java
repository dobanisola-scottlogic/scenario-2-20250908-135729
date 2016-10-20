package com.scottlogic.hackathon.server.services;

import com.google.inject.Inject;
import com.scottlogic.hackathon.server.models.Team;
import com.scottlogic.hackathon.server.services.stores.TeamStore;
import com.scottlogic.hackathon.server.services.stores.TeamUpdate;
import io.dropwizard.auth.basic.BasicCredentials;
import org.hibernate.criterion.Restrictions;

import java.util.List;
import java.util.UUID;

public class TeamService {
    private final TeamStore teamStore;

    @Inject
    public TeamService(final TeamStore teamStore) {
        this.teamStore = teamStore;
    }

    public Team addTeam(final Team team) {
        team.setId(UUID.randomUUID());
        return teamStore.saveOrUpdate(team);
    }

    public List<Team> getTeams() {
        return teamStore.list();
    }

    public List<Team> getTeamsByHackathon(final UUID hackathonId) {
        return teamStore.list(Restrictions.eq("hackathonId", hackathonId));
    }

    public Team getTeam(final UUID id) {
        return teamStore.get(id);
    }

    public Team getTeam(final String name) {
        return teamStore.get(Restrictions.eq("name", name));
    }

    public Team updateTeam(final UUID id, final TeamUpdate teamUpdate) {
        return teamStore.update(id, teamUpdate);
    }

    public boolean deleteTeam(final UUID id) {
        return teamStore.delete(id);
    }

    public boolean authenticate(final BasicCredentials credentials) {
        final Team team = getTeam(credentials.getUsername());
        return team != null && team.authenticate(credentials);
    }
}
