package com.scottlogic.hackathon.game.engine;

import java.util.Set;
import java.util.concurrent.ThreadFactory;
import org.junit.Before;
import org.junit.Test;

import com.scottlogic.hackathon.game.*;
import com.scottlogic.hackathon.game.engine.config.GameConfigLayer;
import com.scottlogic.hackathon.game.engine.maps.Arena;

import static org.junit.Assert.assertNotNull;
import static org.powermock.api.mockito.PowerMockito.mock;
import static org.powermock.api.mockito.PowerMockito.when;

public class GameEngineTest {

  Arena arena;
  GameConfigLayer layer;
  GameGeometry geometry;
  Set<Bot> bots;

  @Before
  public void setUp() {
    layer = mock(GameConfigLayer.class);
    geometry = mock(GameGeometry.class);
    arena = mock(Arena.class);
    when(arena.getMapSpecificConfig()).thenReturn(layer);
    when(arena.getGeometry()).thenReturn(geometry);
    when(arena.getFoodSpawnPositions()).thenReturn(Set.of(mock(Position.class)));
    when(arena.getSpawnPointPositions()).thenReturn(Set.of(mock(Position.class), mock(Position.class)));
    bots = Set.of(mock(Bot.class), mock(Bot.class));
  }

  @Test
  public void testGameEngineCreation() {
    GameEngine gameEngine = GameEngine.create(layer, arena, bots);

    assertNotNull(gameEngine);
  }

  @Test
  public void testGameEngineCreationWithThreadFactory() {
    ThreadFactory threadFactory = mock(ThreadFactory.class);
    GameEngine gameEngine = GameEngine.create(layer, arena, bots, threadFactory);

    assertNotNull(gameEngine);
  }

  @Test
  public void testGameEngineCreateDebug() {
    GameEngine gameEngine = GameEngine.createDebug(layer, arena, bots);

    assertNotNull(gameEngine);
  }
}
