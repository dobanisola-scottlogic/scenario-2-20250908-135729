package com.scottlogic.hackathon.bots;

import org.junit.Test;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertNull;
import static org.junit.Assert.assertTrue;

public class NodeTest {
  @Test
  public void testNodeConstruction() {
    Node node = new Node(1, 2);
    assertEquals(1, node.getX());
    assertEquals(2, node.getY());
    assertFalse(node.isWater());
    assertFalse(node.isFood());
    assertFalse(node.isHive());
    assertFalse(node.isEnemy());
    assertEquals(100, node.getExploreValue());
    assertTrue(node.getPrevFirsts().isEmpty());
    assertNull(node.getPrevious());
    assertFalse(node.isReached());
    assertNull(node.getAgent());
    assertFalse(node.isOccupied());
  }
}
