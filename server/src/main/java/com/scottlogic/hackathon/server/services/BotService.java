package com.scottlogic.hackathon.server.services;

import com.google.inject.Inject;
import com.scottlogic.hackathon.game.Bot;
import com.scottlogic.hackathon.server.authentication.User;
import com.scottlogic.hackathon.server.models.Team;
import com.scottlogic.hackathon.server.models.UploadedBot;
import com.scottlogic.hackathon.server.services.stores.ActiveBot;
import com.scottlogic.hackathon.server.services.stores.BotStore;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.InputStream;
import java.util.Collections;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

public class BotService {
    private final Logger logger;
    private final BotStore botStore;
    private final TeamService teamService;

    @Inject
    public BotService(final BotStore botStore, final TeamService teamService) {
        logger = LoggerFactory.getLogger(this.getClass().getName());
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

    public List<UploadedBot> getActiveBots(final User user) {
        List<UploadedBot> visibleActiveBots = botStore.getActiveBots();

        if (user.getRole() == User.Role.TEAM) {
            final UUID teamId = teamService.getTeam(user.getName()).getId();

            visibleActiveBots = visibleActiveBots.stream()
                    .filter(uploadedBot -> uploadedBot.getTeamId().equals(teamId))
                    .collect(Collectors.toList());
        }

        return Collections.unmodifiableList(visibleActiveBots);
    }

    public UploadedBot setActiveBot(final User user, final ActiveBot activeBot) {
        UploadedBot result = null;
        Team team = null;

        if (user.getRole() == User.Role.ADMIN) {
            team = teamService.getTeam(activeBot.getTeamId());
        } else {
            final Team usersTeam = teamService.getTeam(user.getName());
            if (usersTeam.getId().equals(activeBot.getTeamId()) || activeBot.getTeamId() == null) {
                team = usersTeam;
            } else {
                logger.error("Requested team id is not your team id");
            }
        }

        if (team != null) {
            final UploadedBot uploadedBot = getBot(activeBot.getBotId());
            if (uploadedBot != null) {
                if (botStore.setActiveBot(uploadedBot) != null) {
                    result = uploadedBot;
                }
            }
        }

        return result;
    }
}
