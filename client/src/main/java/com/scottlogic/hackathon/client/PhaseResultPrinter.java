package com.scottlogic.hackathon.client;

import com.scottlogic.hackathon.game.*;
import org.fusesource.jansi.Ansi;

import java.util.Arrays;
import java.util.HashMap;
import java.util.Set;
import java.util.UUID;

public class PhaseResultPrinter {
    private static final Ansi.Color[] COLORS = new Ansi.Color[]{
            Ansi.Color.GREEN,
            Ansi.Color.BLUE,
            Ansi.Color.YELLOW,
            Ansi.Color.MAGENTA
    };
    private static final char PLAYER = '*';
    private static final char SPAWN_POINT = 'O';
    private static final char COLLECTABLE = '+';
    private static final char OUT_OF_BOUNDS_POSITION = 'X';
    private static final char SEPARATOR = '-';
    private final Set<Bot> bots;
    private final GameResult gameResult;
    private final PhaseResult phaseResult;
    private final Tile[][] tiles;
    private final Ansi ansi;
    private final HashMap<UUID, Ansi.Color> ownerColors = new HashMap<UUID, Ansi.Color>();

    public PhaseResultPrinter(final Set<Bot> bots, final GameResult gameResult, final PhaseResult phaseResult) {
        this.bots = bots;
        this.gameResult = gameResult;
        this.phaseResult = phaseResult;
        this.tiles = new Tile[this.gameResult.getMap().getHeight()][this.gameResult.getMap().getWidth()];
        this.ansi = Ansi.ansi();
        this.createOwnerColors();
    }


    private void createOwnerColors() {
        for (final Bot bot : bots) {
            ownerColors.put(bot.getId(), COLORS[ownerColors.size()]);
        }
    }

    private void addTile(final Player player) {
        final Ansi.Color color = ownerColors.get(player.getOwner());
        addTile(player.getPosition(), PLAYER, color);
    }

    private void addTile(final Position position, final char character, final Ansi.Color color) {
        tiles[position.getY()][position.getX()] = new Tile(character, color);
    }

    private void addTile(final SpawnPoint spawnPoint) {
        final Ansi.Color color = ownerColors.get(spawnPoint.getOwner());
        addTile(spawnPoint.getPosition(), SPAWN_POINT, color);
    }

    private void addTile(final Collectable collectable) {
        addTile(collectable.getPosition(), COLLECTABLE, Ansi.Color.WHITE);
    }

    private void addTile(final Position outOfBoundsPosition) {
        addTile(outOfBoundsPosition, OUT_OF_BOUNDS_POSITION, Ansi.Color.RED);
    }

    public void print() {
        phaseResult.getPlayers().forEach(this::addTile);
        phaseResult.getSpawnPoints().forEach(this::addTile);
        phaseResult.getCollectables().forEach(this::addTile);
        gameResult.getOutOfBoundPositions().forEach(this::addTile);

        ansi
                .eraseScreen()
                .a(String.format("Phase %s of %s", phaseResult.getPhase(), gameResult.getPhaseResults().size()))
                .newline();

        for (final Bot bot : bots) {
            ansi
                    .fg(ownerColors.get(bot.getId()))
                    .a(String.format(bot.getDisplayName()))
                    .newline();
        }

        printSeperator();
        for (final Tile[] row : tiles) {
            for (final Tile tile : row) {
                printTile(tile);
            }
            ansi.newline();
        }
        printSeperator();
        System.out.println(ansi.reset());
    }

    private void printSeperator() {
        final char[] seperator = new char[gameResult.getMap().getWidth()];
        Arrays.fill(seperator, SEPARATOR);
        ansi
                .reset()
                .a(seperator)
                .newline();
    }

    private void printTile(final Tile tile) {
        if (tile != null) {
            ansi
                    .fg(tile.getColor())
                    .a(tile.getCharacter());
        } else {
            ansi.a(' ');
        }
    }

    private class Tile {
        private final char character;
        private final Ansi.Color color;

        public Tile(final char character, final Ansi.Color color) {
            this.character = character;
            this.color = color;
        }

        public char getCharacter() {
            return character;
        }

        public Ansi.Color getColor() {
            return color;
        }
    }
}
