package com.scottlogic.hackathon.server.services;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.scottlogic.hackathon.server.authentication.User;
import com.scottlogic.hackathon.server.models.Hackathon;
import com.scottlogic.hackathon.server.services.stores.HackathonStore;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class HackathonServiceTest {

    private static final User ADMIN = new User("admin", User.Role.ADMIN);
    private static final String ID = "hackathon-name";
    private static final String NAME = "Hackathon name";

    @Mock
    private HackathonStore hackathonStore;

    private HackathonService hackathonService;

    @BeforeEach
    void setUp() {
        hackathonService = new HackathonService(hackathonStore);
    }

    @Test
    void createHackathon() {
        var request = new Hackathon();
        request.setName(NAME);

        var hackathon = new Hackathon(NAME);
        when(hackathonStore.save(hackathon)).thenReturn(hackathon);

        var result = hackathonService.createHackathon(ADMIN, request);

        assertEquals(ID, result.getId());
        assertEquals(NAME, result.getName());
        assertEquals("com.scottlogic.hackathon.bots.Milestone1Bot", result.getCurrentMilestoneClassName());
        assertEquals("Easy", result.getCurrentMilestoneMap());
    }

    @Test
    void createHackathon_exceptionOnDuplicateID() {
        var request = new Hackathon();
        request.setName(NAME.toUpperCase());

        var hackathon = new Hackathon(NAME);
        when(hackathonStore.get(ID)).thenReturn(hackathon);

        var thrown = assertThrows(IllegalArgumentException.class,
                () -> hackathonService.createHackathon(ADMIN, request));

        assertEquals("Hackathon with ID hackathon-name already exists", thrown.getMessage());
    }

    @Test
    void createHackathon_exceptionOnEmptyName() {
        var request = new Hackathon();
        request.setName("");

        var thrown = assertThrows(IllegalArgumentException.class,
        () -> hackathonService.createHackathon(ADMIN, request));

        assertEquals("Hackathon name cannot be empty", thrown.getMessage());
    }

    @Test
    void createHackathon_exceptionOnSpacesName() {
        var request = new Hackathon();
        request.setName("        ");

        var thrown = assertThrows(IllegalArgumentException.class,
        () -> hackathonService.createHackathon(ADMIN, request));

        assertEquals("Hackathon name cannot be empty", thrown.getMessage());
    }
}
