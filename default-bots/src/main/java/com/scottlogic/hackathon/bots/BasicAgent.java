package com.scottlogic.hackathon.bots;

import com.scottlogic.hackathon.game.Direction;
import com.scottlogic.hackathon.game.Move;

import java.util.LinkedList;
import java.util.Random;
import java.util.UUID;

public class BasicAgent implements Move {
    private final UUID player;
    private Direction direction;
    private int x;
    private int y;
    private boolean stayingStill = true;
    private Node currentNode = null;

    private LinkedList<Node> closeEnemies = new LinkedList<Node>();

    private boolean finished = false;


    public BasicAgent(final UUID player, Node start) {
        this.player = player;
        this.x = start.getX();
        this.y = start.getY();
        this.currentNode = start;
    }

    public int getX() {
        return x;
    }

    public void setX(int x) {
        this.x = x;
    }

    public int getY() {
        return y;
    }

    public void setY(int y) {
        this.y = y;
    }

    public Node getCurrentNode() {
        return currentNode;
    }

    public void setCurrentNode(Node currentNode) {
        this.currentNode = currentNode;
    }

    public LinkedList<Node> getCloseEnemies() {
        return closeEnemies;
    }

    public void setCloseEnemies(LinkedList<Node> closeEnemies) {
        this.closeEnemies = closeEnemies;
    }

    public boolean isStayingStill() {
        return stayingStill;
    }

    public void setStayingStill(boolean stayingStill) {
        this.stayingStill = stayingStill;
    }

    public boolean isFinished() {
        return finished;
    }

    public void setFinished(boolean finished) {
        this.finished = finished;
    }

    void moveTo(Node to, String goal) {
        if (to.isOccupied()) {
            stayingStill = true;
            finished = false;
        }

        if (currentNode != null) {
            currentNode.setOccupied(false);
            currentNode.setAgent(null);
        }

        Direction moveDirection = calculateDirection(to.getX() - x, to.getY() - y);
        if (!stayingStill) {
            move(moveDirection);
        }
        currentNode = to;
        to.occupy(this);
        x = to.getX();
        y = to.getY();
    }

    private Direction calculateDirection(int xChange, int yChange) {
        Direction targetDirection;
        stayingStill = false;

        if (yChange > 1 || yChange < -1) {
            yChange = -(int) Math.signum((float) yChange);
        }

        if (xChange > 1 || xChange < -1) {
            xChange = -(int) Math.signum((float) xChange);
        }

        if (xChange == 1) {
            if (yChange == -1) {
                targetDirection = Direction.NORTHEAST;
            } else if (yChange == 1) {
                targetDirection = Direction.SOUTHEAST;
            } else {
                targetDirection = Direction.EAST;
            }
        } else if (xChange == -1) {
            if (yChange == -1) {
                targetDirection = Direction.NORTHWEST;
            } else if (yChange == 1) {
                targetDirection = Direction.SOUTHWEST;
            } else {
                targetDirection = Direction.WEST;
            }
        } else {
            if (yChange == -1) {
                targetDirection = Direction.NORTH;
            } else if (yChange == 1) {
                targetDirection = Direction.SOUTH;
            } else {
                stayingStill = true;
                targetDirection = null;
            }
        }
        return targetDirection;
    }

    private void move(Direction targetDirection) {
        direction = targetDirection;
        finished = true;
    }

    void resetAgent() {
        finished = false;
        stayingStill = true;
    }

    @Override
    public UUID getPlayer() {
        return player;
    }

    @Override
    public Direction getDirection() {
        return direction;
    }

    @Override
    public String toString() {
        return String.format("Player %s - Direction %s", player, direction);
    }
}
