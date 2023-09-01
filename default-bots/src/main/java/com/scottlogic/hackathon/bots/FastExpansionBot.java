package com.scottlogic.hackathon.bots;

import java.util.*;
import java.util.Map.Entry;
import java.util.stream.Collectors;

import com.scottlogic.hackathon.game.Bot;
import com.scottlogic.hackathon.game.GameState;
import com.scottlogic.hackathon.game.Id;
import com.scottlogic.hackathon.game.Move;

public class FastExpansionBot extends Bot {
  private final LinkedList<BasicAgent> agents = new LinkedList<BasicAgent>();
  private Node[] map;
  private int mapWidth;
  private int mapHeight;
  private final int EXPLORE_DISTANCE = 6;
  private final int HIVE_ATTACK_RANGE = 16;
  private final int ATTACK_RANGE = 4;
  private final int DANGER_ZONE = 4;
  private final int AGENT_SUPPORT_SIZE = 3;
  private final int LARGE_ARMY = 10;
  private final int LARGE_ATTACK = 5;
  private final int SMALL_ATTACK = 2;
  private LinkedList<Node> foods = new LinkedList<Node>();
  private LinkedList<Node> enemyHives = new LinkedList<Node>();
  private LinkedList<Node> enemies = new LinkedList<Node>();
  private LinkedList<Node> water = new LinkedList<Node>();
  private LinkedList<Node> enemyHiveMemory = new LinkedList<Node>();

  public FastExpansionBot() {
    super("Fast Expansion");
  }

  @Override
  public void initialise(final GameState initialGameState) {
    mapWidth = initialGameState.getMap().getWidth();
    mapHeight = initialGameState.getMap().getHeight();
    generateMap();
  }

  @Override
  public List<Move> makeMoves(final GameState gameState) {

    // manage the state of my players
    managePlayers(gameState);

    // keep the map up to date
    updateMap(gameState);

    // reset the agents
    agents.forEach(
        agent -> {
          // setup agents for this phase
          setupAgent(agent);
        });

    initialiseExplore();
    attackEnemyHives();
    fightOtherAnts();
    collectFood();

    // for each agent that has still not done something
    agents.forEach(
        agent -> {
          if (!agent.isFinished()) {
            // explore
            makeAgentExplore(agent, EXPLORE_DISTANCE, true);
          }
        });

    // return the moves
    List<BasicAgent> agentsWithMoves = new LinkedList<BasicAgent>();
    agents.forEach(
        agent -> {
          if (agent.isFinished()) {
            agentsWithMoves.add(agent);
          }
        });

    return Collections.unmodifiableList(agentsWithMoves);
  }

  private void setupAgent(BasicAgent agent) {
    agent.resetAgent();
  }

  private void managePlayers(final GameState gameState) {
    // get the removed players
    gameState
        .getRemovedPlayers()
        .forEach(
            player -> {
              // if my moves contains that player, remove it
              agents.removeIf(agent -> agent.getPlayer().equals(player.getId()));
            });

    // create a set of all my previous players
    final Set<Id> previousPlayers =
        agents.stream().map(BasicAgent::getPlayer).collect(Collectors.toSet());

    // look through all the players
    gameState
        .getPlayers()
        .forEach(
            player -> {
              // if their owner is me and it is not in my previous players
              if (player.getOwner().equals(getId())) {
                if (!previousPlayers.contains(player.getId())) {
                  // create an ai for it.
                  agents.add(
                      new BasicAgent(
                          player.getId(),
                          getNode(player.getPosition().getX(), player.getPosition().getY())));
                } else {
                  agents.forEach(
                      agent -> {
                        if (agent.getPlayer().equals(player.getId())) {
                          agent.setX(player.getPosition().getX());
                          agent.setY(player.getPosition().getY());
                        }
                      });
                }
              }
            });
  }

  private void generateMap() {
    map = new Node[mapWidth * mapHeight];

    // generate the nodes
    for (int y = 0; y < mapHeight; ++y) {
      for (int x = 0; x < mapWidth; ++x) {
        map[y * mapWidth + x] = new Node(x, y);
      }
    }
  }

  void updateMap(final GameState gameState) {

    // increase time since nodes were seen
    for (int i = 0; i < map.length; ++i) {
      map[i].increaseExploreValue();
      map[i].resetValues();
    }

    // i only care about what i can currently see, so reset lists
    foods = new LinkedList<Node>();
    enemyHives = new LinkedList<Node>();
    enemies = new LinkedList<Node>();

    // update collectables
    gameState
        .getCollectables()
        .forEach(
            collectable -> {
              Node node =
                  getNode(collectable.getPosition().getX(), collectable.getPosition().getY());
              node.setNodeType(NodeType.Food);
              foods.add(node);
            });

    Collections.sort(
        foods,
        (o1, o2) -> {
          int n1 = o1.getY() * mapWidth + o1.getX();
          int n2 = o2.getY() * mapWidth + o2.getX();
          if (n1 < n2) {
            return -1;
          }
          return 1;
        });

    // update water Nodes
    gameState
        .getOutOfBoundsPositions()
        .forEach(
            position -> {
              Node waterNode = getNode(position.getX(), position.getY());
              if (!waterNode.isWater()) {
                waterNode.setNodeType(NodeType.Water);
                water.add(waterNode);
              }
            });

    // update hiveNodes
    gameState
        .getSpawnPoints()
        .forEach(
            spawnPoint -> {
              if (!spawnPoint.getOwner().equals(getId())) {
                Node hive =
                    getNode(spawnPoint.getPosition().getX(), spawnPoint.getPosition().getY());
                hive.setNodeType(NodeType.Hive);
                enemyHives.add(hive);
                if (!enemyHiveMemory.contains(hive)) {
                  enemyHiveMemory.add(hive);
                }
              }
            });

    // update enemy agents locations
    gameState
        .getPlayers()
        .forEach(
            player -> {
              // if their owner is me and it is not in my previous players
              if (!player.getOwner().equals(getId())) {
                Node enemyNode = getNode(player.getPosition().getX(), player.getPosition().getY());
                enemyNode.setNodeType(NodeType.Enemy);
                enemies.add(enemyNode);
              }
            });

    Iterator<Node> itr = enemyHiveMemory.iterator();
    while (itr.hasNext()) {
      Node hive = itr.next();
      agents.forEach(
          agent -> {
            if (getNode(agent.getX(), agent.getY()) == hive) {
              itr.remove();
            }
          });
    }
  }

  private List<Node> getNodeNeighbours(Node currentNode) {
    List<Node> neighbours = new LinkedList<Node>();

    for (int y = -1; y <= 1; ++y) {
      for (int x = -1; x <= 1; ++x) {
        Node neighbour = getNode(currentNode.getX() + x, currentNode.getY() + y);
        if (!neighbour.isWater()) {
          neighbours.add(neighbour);
        }
      }
    }

    neighbours.remove(currentNode);

    return neighbours;
  }

  private void initialiseExplore() {
    LinkedList<Node> openList = new LinkedList<Node>();
    LinkedList<Node> changedNodes = new LinkedList<Node>();

    agents.forEach(agent -> openList.add(getNode(agent.getX(), agent.getY())));

    for (Node node : openList) {
      node.setDistance(0);
      node.setReached(true);
      node.setStartNode(node);
      changedNodes.add(node);
    }

    while (!openList.isEmpty()) {
      Node node = openList.removeFirst();

      if (node.getDistance() > EXPLORE_DISTANCE) {
        break;
      }

      node.setExploreValue(0);
      for (Node neighbour : getNodeNeighbours(node)) {
        if (neighbour.isReached()) {
          continue;
        }
        neighbour.setReached(true);
        neighbour.setPrevious(node);
        neighbour.setDistance(node.getDistance() + 1);
        neighbour.setStartNode(node.getStartNode());
        changedNodes.add(neighbour);
        openList.add(neighbour);
      }
    }

    // set them back to false
    changedNodes.forEach(node -> node.setReached(false));
  }

  private void fightOtherAnts() {
    for (Node enemy : enemies) {
      int count = 2; // number of agents to send to fight
      LinkedList<Node> openList = new LinkedList<Node>();
      LinkedList<Node> changedNodes = new LinkedList<Node>();
      enemy.setDistance(0);
      enemy.setReached(true);
      openList.add(enemy);
      changedNodes.add(enemy);

      while (!openList.isEmpty() && count > 0) {
        Node node = openList.removeFirst();
        if (node.getDistance() >= ATTACK_RANGE) {
          break;
        }

        for (Node neighbour : getNodeNeighbours(node)) {
          if (neighbour.isReached()) {
            continue;
          }
          neighbour.setReached(true);
          if (neighbour.isOccupied()) {
            if (!neighbour.getAgent().isFinished() && !node.isOccupied() && !node.isWater()) {
              neighbour.getAgent().moveTo(node, "attackAgent");
            }
            count--;
          }
          neighbour.setDistance(node.getDistance() + 1);
          changedNodes.add(neighbour);
          openList.add(neighbour);
        }
      }

      changedNodes.forEach(
          node -> {
            node.setReached(false);
            node.setDistance(0);
          });
    }
  }

  private boolean makeAgentExplore(BasicAgent agent, int range, boolean firstPass) {

    HashMap<Node, Integer> values = new HashMap<Node, Integer>();
    LinkedList<Node> openList = new LinkedList<Node>();
    LinkedList<Node> changedNodes = new LinkedList<Node>();
    Node agentNode = getNode(agent.getX(), agent.getY());
    agentNode.setReached(true);
    agentNode.setDistance(0);
    changedNodes.add(agentNode);

    // set starting nodes
    for (Node neighbour : getNodeNeighbours(agentNode)) {
      values.put(neighbour, 0);
      openList.add(neighbour);
      neighbour.setDistance(1);
      neighbour.setReached(true);
      neighbour.getPrevFirsts().add(neighbour);
      changedNodes.add(neighbour);
    }

    // find the distance to each node
    while (!openList.isEmpty()) {
      Node node = openList.removeFirst();

      if (node.getDistance() > range) {
        for (Node prevFirst : node.getPrevFirsts()) {
          values.put(prevFirst, values.get(prevFirst) + node.getExploreValue());
        }
        continue;
      }

      for (Node neighbour : getNodeNeighbours(node)) {
        if (neighbour.isReached()) {
          if (neighbour.getDistance() == node.getDistance() + 1) {
            neighbour.getPrevFirsts().addAll(node.getPrevFirsts());
          }
          continue;
        }
        neighbour.setReached(true);
        neighbour.setPrevious(node);
        neighbour.setDistance(node.getDistance() + 1);
        neighbour.getPrevFirsts().addAll(node.getPrevFirsts());
        changedNodes.add(neighbour);
        openList.add(neighbour);
      }
    }

    int bestValue = 0;
    Node bestDestination = null;
    for (Entry<Node, Integer> entry : values.entrySet()) {
      if (!entry.getKey().isWater()
          && !entry.getKey().isHive()
          && entry.getValue() > bestValue
          && !entry.getKey().isOccupied()) {
        bestValue = entry.getValue();
        bestDestination = entry.getKey();
      }
    }

    if (bestValue == 0 || bestDestination == null) {
      for (Node node : changedNodes) {
        node.setReached(false);
        node.getPrevFirsts().clear();
        node.setPrevious(null);
      }

      // if the agent cant see any locations that needs visiting, need to think of a task for them
      if (firstPass) {
        // increase their search range and try again
        return makeAgentExplore(agent, EXPLORE_DISTANCE * 3, false);
      } else {
        // just move out of the way of other ants
        // this stops corridors being blocked or ants standing on the hive and dying
        moveToEmptyTile(agent);
        return false;
      }
    }

    for (Node node : changedNodes) {
      if (node.getDistance() < EXPLORE_DISTANCE && node.getPrevFirsts().contains(bestDestination)) {
        node.setExploreValue(0);
      }
      node.setReached(false);
      node.getPrevFirsts().clear();
      node.setPrevious(null);
    }
    agent.moveTo(bestDestination, "explore");
    return true;
  }

  private void moveToEmptyTile(BasicAgent agent) {
    LinkedList<Node> availableNodes = new LinkedList<Node>();
    for (Node node : getNodeNeighbours(getNode(agent.getX(), agent.getY())))
      if (!node.isOccupied() && !node.isWater()) {
        availableNodes.add(node);
      }
    Random random = new Random();

    if (availableNodes.size() > 0) {
      Node target = availableNodes.get(random.nextInt(availableNodes.size()));
      agent.moveTo(target, "getOutOfTheWay");
    } else {
      agent.setFinished(false);
      agent.setStayingStill(true);
    }
  }

  private void collectFood() {
    // set all the starting nodes
    for (Node food : foods) {
      HashMap<Node, Boolean> isEnemyNearFood = new HashMap<Node, Boolean>();
      LinkedList<Node> openList = new LinkedList<Node>();
      LinkedList<Node> changedNodes = new LinkedList<Node>();

      openList.add(food);
      food.setDistance(0);
      food.setReached(true);
      food.setSource(food);
      isEnemyNearFood.put(food, false);
      changedNodes.add(food);

      // bfs
      while (!openList.isEmpty()) {
        Node node = openList.removeFirst();

        if (node.getDistance() <= 2 && node.isEnemy()) {
          isEnemyNearFood.put(node.getSource(), true);
        }

        if (node.getDistance() > 2 && isEnemyNearFood.get(node.getSource())) {
          Iterator<Node> changedNodesIterator = changedNodes.iterator();
          while (changedNodesIterator.hasNext()) {
            Node neighbour = changedNodesIterator.next();
            if (neighbour.getSource() == node.getSource()) {
              neighbour.setReached(false);
              changedNodesIterator.remove();
            }
          }
          changedNodesIterator = openList.iterator();
          while (changedNodesIterator.hasNext()) {
            if (!changedNodesIterator.next().isReached()) {
              changedNodesIterator.remove();
            }
          }
        } else if (node.getPrevious() != null
            && node.isOccupied()
            && !node.getAgent().isFinished()
            && !node.getPrevious().isWater()
            && !node.getPrevious().isOccupied()) {
          if (node.getPrevious() == node.getSource()) {
            node.getAgent().moveTo(node.getPrevious(), "collectFood");
            break;
          } else {
            Node closeEnemy = isNodeSafe(node.getAgent(), node.getPrevious());
            if (closeEnemy != null) {
              Collection<BasicAgent> closeAgents =
                  getCloseAgentDistances(node.getSource()).values();
              boolean hasBackup = false;
              for (BasicAgent closeAgent : closeAgents) {
                if (closeAgent != node.getAgent()) {
                  hasBackup = true;
                  break;
                }
              }
              if (hasBackup) {
                node.getAgent().moveTo(node.getPrevious(), "moveToFoodWithBackup");
              }
            } else {
              node.getAgent().moveTo(node.getPrevious(), "moveToFood");
              break;
            }
          }

        } else if (node.getDistance() < EXPLORE_DISTANCE) {
          // if its still in search range, add the new node
          for (Node neighbour : getNodeNeighbours(node)) {

            if (neighbour.isReached()) {
              continue;
            }
            neighbour.setReached(true);
            neighbour.setPrevious(node);
            neighbour.setDistance(node.getDistance() + 1);
            neighbour.setSource(node.getSource());
            changedNodes.add(neighbour);
            openList.add(neighbour);
          }
        }
      }

      // reset the nodes
      changedNodes.forEach(node -> node.setReached(false));
    }
  }

  private void attackEnemyHives() {
    for (Node hiveNode : enemyHives) {
      int count = agents.size() <= LARGE_ARMY ? SMALL_ATTACK : LARGE_ATTACK;
      LinkedList<Node> openList = new LinkedList<Node>();
      LinkedList<Node> changedNodes = new LinkedList<Node>();
      hiveNode.setDistance(0);
      hiveNode.setReached(true);
      openList.add(hiveNode);
      changedNodes.add(hiveNode);

      while (!openList.isEmpty() && count > 0) {
        Node node = openList.removeFirst();
        if (node.getDistance() >= HIVE_ATTACK_RANGE) {
          break;
        }

        for (Node neighbour : getNodeNeighbours(node)) {
          if (neighbour.isReached()) {
            continue;
          }
          neighbour.setReached(true);
          if (neighbour.isOccupied()) {
            // additional checks to see enemy locations could be done here
            if (!neighbour.getAgent().isFinished() && !node.isOccupied() && !node.isWater()) {
              neighbour.getAgent().moveTo(node, "attackHive");
            }
            count--;
          }
          neighbour.setDistance(node.getDistance() + 1);
          changedNodes.add(neighbour);
          openList.add(neighbour);
        }
      }

      // reset the nodes
      changedNodes.forEach(
          node -> {
            node.setReached(false);
            node.setDistance(0);
            node.setPrevious(null);
          });
    }
  }

  private Node isNodeSafe(BasicAgent agent, Node destination) {
    for (Node enemy : agent.getCloseEnemies()) {
      if (isNodeInDangerZone(destination, enemy)) {
        return enemy;
      }
    }
    return null;
  }

  private boolean isNodeInDangerZone(Node node, Node enemy) {
    int dx = enemy.getX() - node.getX();
    int dy = enemy.getY() - node.getY();
    int xDistance = Math.min(dx, mapWidth - dx);
    int yDistance = Math.min(dy, mapHeight - dy);
    int distance = (xDistance * xDistance) + (yDistance * yDistance);
    if (distance <= DANGER_ZONE) {
      return !((dx == 0 && dy == DANGER_ZONE) || (dx == DANGER_ZONE && dy == 0));
    }
    return false;
  }

  private TreeMap<Integer, BasicAgent> getCloseAgentDistances(Node source) {
    TreeMap<Integer, BasicAgent> closeAgentDistances = new TreeMap<Integer, BasicAgent>();
    for (BasicAgent agent : agents) {
      Integer distance = getDistance(source, getNode(agent.getX(), agent.getY()));
      if (distance < DANGER_ZONE * DANGER_ZONE) {
        closeAgentDistances.put(distance, agent);
        // if there are enough supporting agents
        if (closeAgentDistances.size() >= AGENT_SUPPORT_SIZE) {
          break;
        }
      }
    }
    return closeAgentDistances;
  }

  private int getDistance(Node n1, Node n2) {
    int dx = n2.getX() - n1.getX();
    int dy = n2.getY() - n1.getY();
    int xDistance = Math.min(dx, mapWidth - dx);
    int yDistance = Math.min(dy, mapHeight - dy);
    return (xDistance * xDistance) + (yDistance * yDistance);
  }

  private Node getNode(int x, int y) {
    int modY = y % mapHeight;
    int modX = x % mapWidth;

    if (modX < 0) {
      modX += mapWidth;
    }
    if (modY < 0) {
      modY += mapHeight;
    }

    return map[(modY * mapWidth) + modX];
  }
}
