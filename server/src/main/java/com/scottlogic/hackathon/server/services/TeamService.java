package com.scottlogic.hackathon.server.services;

import com.google.inject.Inject;
import com.scottlogic.hackathon.server.models.Team;
import com.scottlogic.hackathon.server.services.stores.TeamStore;
import com.scottlogic.hackathon.server.services.stores.TeamUpdate;

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

    public Team getTeam(final UUID id) {
        return teamStore.getTeam(id);
    }

    public Team updateTeam(final UUID id, final TeamUpdate teamUpdate) {
        return teamStore.update(id, teamUpdate);
    }

    public boolean deleteTeam(final UUID id) {
        return teamStore.deleteTeam(id);
    }
}
