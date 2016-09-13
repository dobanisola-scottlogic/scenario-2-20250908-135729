package com.scottlogic.hackathon.game;

/**
 * A position in (x, y) coordinate space - (0, 0) being top-left.
 */
public class Position {
    private final int x;
    private final int y;

    /**
     * Constructs and initialises a position at the specified
     * (x, y) location
     * @param x the X coordinate of the newly constructed Position
     * @param y the Y coordinate of the newly constructed Position
     */
    public Position(final int x, final int y) {
        if (x < 0) {
            throw new IllegalArgumentException("x must be >= 0");
        }
        if (y < 0) {
            throw new IllegalArgumentException("y must be >= 0");
        }
        this.x = x;
        this.y = y;
    }

    /**
     *
     * @return a hash code for this position
     */
    @Override
    public int hashCode() {
        return Integer.hashCode(x) ^ Integer.hashCode(y);
    }

    /**
     *
     * @param obj an object to be compared with this Position
     * @return true if the object to be compared is a Position and has the same values
     */
    @Override
    public boolean equals(final Object obj) {
        return obj != null
                && obj instanceof Position
                && x == ((Position) obj).getX()
                && y == ((Position) obj).getY();
    }

    /**
     * @return the X coordinate of this Position
     */
    public int getX() {
        return x;
    }

    /**
     * @return the Y coordinate of this Position
     */
    public int getY() {
        return y;
    }

    /**
     * @return a string representation of this position
     */
    @Override
    public String toString() {
        return String.format("X %s - Y %s", x, y);
    }
}

