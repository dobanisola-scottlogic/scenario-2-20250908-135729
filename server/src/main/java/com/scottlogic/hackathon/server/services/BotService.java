package com.scottlogic.hackathon.server.services;

import com.google.inject.Inject;
import com.scottlogic.hackathon.game.Bot;
import com.scottlogic.hackathon.server.authentication.User;
import com.scottlogic.hackathon.server.models.Team;
import com.scottlogic.hackathon.server.models.UploadedBot;
import com.scottlogic.hackathon.server.services.stores.BotStore;

import java.io.InputStream;
import java.util.List;
import java.util.UUID;

public class BotService {
    private final BotStore botStore;
    private final TeamService teamService;

    @Inject
    public BotService(final BotStore botStore, final TeamService teamService) {
        this.botStore = botStore;
        this.teamService = teamService;
    }

    public UploadedBot addBot(final Team team, final String botClassName, final InputStream inputStream) {
        UploadedBot result = null;

        final UploadedBot uploadedBot = new UploadedBot(team);
        uploadedBot.setBotClassName(botClassName);
        uploadedBot.setData(inputStream);

        final Bot validBot = uploadedBot.getBot();
        if (validBot != null) {
            result = botStore.saveBot(uploadedBot);
        }

        return result;
    }

    public UploadedBot getBot(final UUID id) {
        return botStore.getBot(id);
    }

    public List<UploadedBot> getUploadedBots(final User user) {
        final List<UploadedBot> allVisibleBots;
        if (user.getRole() == User.Role.ADMIN) {
            allVisibleBots = botStore.getUploadedBots();
        } else {
            final Team team = teamService.getTeam(user.getName());
            allVisibleBots = botStore.getUploadedBots(team);
        }
        return allVisibleBots;
    }

    public boolean deleteUploadedBot(final User user, final UUID id) {
        boolean result = false;

        if (userCanAccessBot(user, id)) {
            result = botStore.deleteUploadedBot(id);
        }

        return result;
    }

    private boolean userCanAccessBot(final User user, final UUID id) {
        boolean result = false;

        if (user.getRole() == User.Role.ADMIN) {
            result = true;
        } else if (user.getRole() == User.Role.TEAM) {
            final Team team = teamService.getTeam(user.getName());
            final UploadedBot uploadedBot = botStore.getBot(id);

            if (uploadedBot != null && team.getId().equals(uploadedBot.getTeamId())) {
                result = true;
            }
        }

        return result;
    }
}
