package com.scottlogic.hackathon.server.services;

import java.util.List;
import com.google.common.base.Preconditions;
import com.google.inject.Inject;

import com.scottlogic.hackathon.server.authentication.User;
import com.scottlogic.hackathon.server.models.Hackathon;
import com.scottlogic.hackathon.server.models.HackathonUpdate;
import com.scottlogic.hackathon.server.services.stores.HackathonStore;

public class HackathonService {
  private final HackathonStore hackathonStore;

  @Inject
  public HackathonService(final HackathonStore hackathonStore) {
    this.hackathonStore = hackathonStore;
  }

  public Hackathon createHackathon(final User user, final Hackathon hackathon) {
    var entity = new Hackathon(hackathon.getName());

    Preconditions.checkArgument(
      !entity.getName().isEmpty(),
      "Hackathon name cannot be empty");

    Preconditions.checkArgument(
            hackathonStore.get(entity.getId()) == null,
            "Hackathon with ID %s already exists",
            entity.getId()
    );

    return hackathonStore.save(entity);
  }

  public Hackathon updateHackathon(final String id, final HackathonUpdate hackathonUpdate) {
    return hackathonStore.update(id, hackathonUpdate);
  }

  public List<Hackathon> getHackathons() {
    return hackathonStore.list();
  }

  public Hackathon getHackathon(final String id) {
    return hackathonStore.get(id);
  }

  public boolean deleteHackathon(final String id) {
    return hackathonStore.delete(id);
  }
}
