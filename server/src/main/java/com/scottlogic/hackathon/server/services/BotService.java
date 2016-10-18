package com.scottlogic.hackathon.server.services;

import com.google.inject.Inject;
import com.scottlogic.hackathon.game.Bot;
import com.scottlogic.hackathon.server.authentication.User;
import com.scottlogic.hackathon.server.models.GameConfiguration;
import com.scottlogic.hackathon.server.models.Hackathon;
import com.scottlogic.hackathon.server.models.MilestoneBot;
import com.scottlogic.hackathon.server.models.Team;
import com.scottlogic.hackathon.server.models.UploadedBot;
import com.scottlogic.hackathon.server.services.stores.ActiveBot;
import com.scottlogic.hackathon.server.services.stores.BotStore;
import org.hibernate.criterion.Restrictions;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.InputStream;
import java.util.Arrays;
import java.util.Collections;
import java.util.HashSet;
import java.util.List;
import java.util.UUID;
import java.util.function.Function;
import java.util.stream.Collectors;
import java.util.stream.Stream;

public class BotService {
    private final Logger logger;
    private final BotStore botStore;
    private final TeamService teamService;
    private final GameService gameService;
    private final MilestoneService milestoneService;
    private final HackathonService hackathonService;

    @Inject
    public BotService(final BotStore botStore,
                      final TeamService teamService,
                      final GameService gameService,
                      final MilestoneService milestoneService,
                      final HackathonService hackathonService) {
        logger = LoggerFactory.getLogger(this.getClass().getName());
        this.botStore = botStore;
        this.teamService = teamService;
        this.gameService = gameService;
        this.milestoneService = milestoneService;
        this.hackathonService = hackathonService;
    }

    public UploadedBot addTeamBot(final User user, final Team team, final String botClassName, final InputStream inputStream) {
        UploadedBot uploadedBot = this.addBot(team, botClassName, inputStream);
        UploadedBot result = null;

        if (uploadedBot != null) {
            if (botStore.setActiveBot(uploadedBot) != null) {
                result = uploadedBot;
            }

            Hackathon hackathon = hackathonService.getHackathon(team.getHackathonId());

            GameConfiguration gameConfiguration = new GameConfiguration(
                    new HashSet<String>(Arrays.asList(team.getName(), hackathon.getCurrentMilestoneClassName())),
                    hackathon.getCurrentMilestoneMap(),
                    hackathon.getId()
            );

            gameService.playGame(user, gameConfiguration, createTeamBotMap(user, gameConfiguration));
        }

        return result;
    }

    public UploadedBot addBot(final Team team, final String botClassName, final InputStream inputStream) {
        UploadedBot result = null;

        final UploadedBot uploadedBot = new UploadedBot(team);
        uploadedBot.setBotClassName(botClassName);
        uploadedBot.setData(inputStream);

        final Bot validBot = uploadedBot.getBot();
        if (validBot != null) {
            result = botStore.saveOrUpdate(uploadedBot);
        }

        return result;
    }

    public UploadedBot getBot(final UUID id) {
        return botStore.get(id);
    }

    public List<UploadedBot> getUploadedBots(final User user) {
        final List<UploadedBot> allVisibleBots;
        if (user.isAdmin()) {
            allVisibleBots = botStore.list();
        } else {
            allVisibleBots = this.getUploadedBots(user.getName());
        }
        return allVisibleBots;
    }

    public List<UploadedBot> getUploadedBots(final String userName) {
        final Team team = teamService.getTeam(userName);
        return botStore.list(Restrictions.eq("teamId", team.getId().toString()));
    }


    public boolean deleteUploadedBot(final User user, final UUID id) {
        boolean result = false;

        if (userCanAccessBot(user, id)) {
            result = botStore.delete(id);
        }

        return result;
    }

    private boolean userCanAccessBot(final User user, final UUID id) {
        boolean result = false;

        if (user.isAdmin()) {
            result = true;
        } else if (user.isTeam()) {
            final Team team = teamService.getTeam(user.getName());
            final UploadedBot uploadedBot = botStore.get(id);

            if (uploadedBot != null && team.getId().equals(uploadedBot.getTeamId())) {
                result = true;
            }
        }

        return result;
    }

    public List<UploadedBot> getActiveBots(final User user) {
        Stream<UploadedBot> activeBots = botStore.list(Restrictions.eq("active", true)).stream();

        if (user.isTeam()) {
            final UUID teamId = teamService.getTeam(user.getName()).getId();

            activeBots = activeBots
                    .filter(activeBot -> activeBot.getTeamId().equals(teamId));
        }

        final List<UploadedBot> bots = activeBots
                .collect(Collectors.toList());

        return Collections.unmodifiableList(bots);
    }

    public UploadedBot setActiveBot(final User user, final ActiveBot activeBot) {
        UploadedBot result = null;
        Team team = null;

        if (user.isAdmin()) {
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

    public java.util.Map<Team, Bot> createTeamBotMap(final User user, final GameConfiguration gameConfiguration) {
        final java.util.Map<UUID, UploadedBot> activeUploadedBots = this
                .getActiveBots(user)
                .stream()
                .collect(Collectors.toMap(uploadedBot -> uploadedBot.getTeamId(), Function.identity()));

        final java.util.Map<String, MilestoneBot> milestoneBots = milestoneService
                .getMilestones()
                .stream()
                .collect(Collectors.toMap(milestoneBot -> milestoneBot.getMilestoneClassName(), Function.identity()));

        final java.util.Map<String, Team> teams = gameConfiguration
                .getTeams()
                .stream()
                .collect(Collectors.toMap(Function.identity(), teamName -> {
                    if (teamName.startsWith(MilestoneBot.MILESTONE_BOT_PREFIX)) {
                        Team adminTeam = new Team();
                        adminTeam.setName(teamName);
                        return adminTeam;
                    } else {
                        return teamService.getTeam(teamName);
                    }
                }));

        final java.util.Map<Team, Bot> teamBots = teams.values()
                .stream()
                .filter(team -> team != null)
                .collect(Collectors.toMap(Function.identity(), team -> {
                    if (team.getName().startsWith(MilestoneBot.MILESTONE_BOT_PREFIX)) {
                        final MilestoneBot milestoneBot = milestoneBots.get(team.getName());
                        return milestoneBot.getBot();
                    } else {
                        final UploadedBot uploadedBot = activeUploadedBots.get(team.getId());
                        return uploadedBot.getBot();
                    }
                }));


        return teamBots;
    }
}
