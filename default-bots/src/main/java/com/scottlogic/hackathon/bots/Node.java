package com.scottlogic.hackathon.bots;

import java.util.HashSet;

enum NodeType {
    Water,
    Food,
    Hive,
    Enemy,
    Empty
}

public class Node {
    private int x;
    private int y;

    private NodeType myType = NodeType.Empty;

    // used in explore method
    private int exploreValue = 100;
    private HashSet<Node> prevFirsts = new HashSet<Node>();

    private int distance;
    private Node previous = null;
    private boolean reached = false;

    //which agent is on the tile
    private BasicAgent agent = null;
    private boolean occupied = false;

    //used for food finding
    private Node source;

    private Node startNode;


    public Node(int x, int y) {
        this.x = x;
        this.y = y;
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

    public void setNodeType(NodeType type) {
        myType = type;
    }

    public boolean isWater() {
        return myType == NodeType.Water;
    }

    public boolean isFood() {
        return myType == NodeType.Food;
    }

    public int getExploreValue() {
        return exploreValue;
    }

    public void setExploreValue(int exploreValue) {
        this.exploreValue = exploreValue;
    }

    public void increaseExploreValue() {
        this.exploreValue++;
    }

    public boolean isHive() {
        return myType == NodeType.Hive;
    }

    public HashSet<Node> getPrevFirsts() {
        return prevFirsts;
    }

    public void setPrevFirsts(HashSet<Node> prevFirsts) {
        this.prevFirsts = prevFirsts;
    }

    public int getDistance() {
        return distance;
    }

    public void setDistance(int distance) {
        this.distance = distance;
    }

    public Node getPrevious() {
        return previous;
    }

    public void setPrevious(Node previous) {
        this.previous = previous;
    }

    public boolean isReached() {
        return reached;
    }

    public void setReached(boolean reached) {
        this.reached = reached;
    }

    public BasicAgent getAgent() {
        return agent;
    }

    public void setAgent(BasicAgent agent) {
        this.agent = agent;
    }

    public boolean isOccupied() {
        return occupied;
    }

    public void setOccupied(boolean occupied) {
        this.occupied = occupied;
    }

    public boolean isEnemy() {
        return myType == NodeType.Enemy;
    }

    public Node getSource() {
        return source;
    }

    public void setSource(Node source) {
        this.source = source;
    }

    public Node getStartNode() {
        return startNode;
    }

    public void setStartNode(Node startNode) {
        this.startNode = startNode;
    }

    public void occupy(BasicAgent agent) {
        this.occupied = true;
        this.agent = agent;
    }

    public void resetValues() {
        if (myType != NodeType.Water) {
            myType = NodeType.Empty;
        }
        reached = false;
        previous = null;
        prevFirsts.clear();
        distance = 0;
        source = null;
    }

}

