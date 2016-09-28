package com.scottlogic.hackathon.server.services;

import com.google.inject.Inject;
import com.scottlogic.hackathon.server.models.Team;
import com.scottlogic.hackathon.server.services.stores.TeamStore;
import com.scottlogic.hackathon.server.services.stores.TeamUpdate;
import io.dropwizard.auth.basic.BasicCredentials;

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
        return teamStore.saveTeam(team);
    }

    public List<Team> getTeams() {
        return teamStore.getTeams();
    }

    public List<Team> getTeamsByHackathon(final UUID hackathonId) {
        return teamStore.getTeamsByHackathon(hackathonId);
    }

    public Team getTeam(final UUID id) {
        return teamStore.getTeam(id);
    }

    public Team getTeam(final String name) {
        return teamStore.getTeam(name);
    }

    public Team updateTeam(final UUID id, final TeamUpdate teamUpdate) {
        return teamStore.update(id, teamUpdate);
    }

    public boolean deleteTeam(final UUID id) {
        return teamStore.deleteTeam(id);
    }

    public boolean authenticate(final BasicCredentials credentials) {
        return getTeam(credentials.getUsername()).authenticate(credentials);
    }
}
