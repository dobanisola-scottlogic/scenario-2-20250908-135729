package com.scottlogic.hackathon.client;

import com.scottlogic.hackathon.game.*;
import com.scottlogic.hackathon.game.engine.maps.PlayableMap;
import org.fusesource.jansi.Ansi;

import java.util.*;
import java.util.Map;

public class PhaseResultPrinter {
    private static final Ansi.Color[] COLORS = new Ansi.Color[]{
            Ansi.Color.GREEN,
            Ansi.Color.BLUE,
            Ansi.Color.YELLOW,
            Ansi.Color.MAGENTA
    };
    private static final char PLAYER = '*';
    private static final char SPAWN_POINT = 'O';
    private static final Tile COLLECTABLE = new Tile('+', Ansi.Color.WHITE);
    private static final Tile OUT_OF_BOUNDS_POSITION = new Tile('X', Ansi.Color.RED);
    private static final char SEPARATOR = '-';
    private final Set<Bot> bots;
    private final PlayableMap map;
    private final Map<UUID, Ansi.Color> ownerColors;
    private final char[] seperator;

    public PhaseResultPrinter(final Set<Bot> bots, final PlayableMap map) {
        this.bots = bots;
        this.map = map;

        Map<UUID, Ansi.Color> ownerColors = new HashMap<>(bots.size());
        int i=0;
        for(Bot bot: bots) {
            ownerColors.put(bot.getId(), COLORS[i++]);
        }
        this.ownerColors = Collections.unmodifiableMap(ownerColors);

        this.seperator = new char[map.getWidth()];
        Arrays.fill(seperator, SEPARATOR);
    }


    public void print(PhaseResult phaseResult, int totalPhases) {
        TileCanvas tiles = new TileCanvas(map.getWidth(), map.getHeight(), ownerColors);

        phaseResult.getPlayers().forEach(tiles::addTile);
        phaseResult.getSpawnPoints().forEach(tiles::addTile);
        phaseResult.getCollectables().forEach(tiles::addTile);
        map.getOutOfBoundsPositions().forEach(tiles::addTile);

        StringBuilder sb = new StringBuilder("Phase ")
                .append(phaseResult.getPhase());
        if(totalPhases > 0) {
            sb.append(" of ").append(totalPhases);
        }

        Ansi ansi = Ansi.ansi();

        ansi
                .newline()
                .a(sb.toString())
                .newline();

        for (final Bot bot : bots) {
            ansi
                    .fg(ownerColors.get(bot.getId()))
                    .a(String.format(bot.getDisplayName()))
                    .newline();
        }

        printSeperator(ansi);
        tiles.print(ansi);
        printSeperator(ansi);
        System.out.println(ansi);
    }

    private void printSeperator(Ansi ansi) {
        ansi
                .reset()
                .a(seperator)
                .newline();
    }

    private static class TileCanvas {
        private final Map<UUID, Ansi.Color> ownerColors;
        private final Tile[][] tiles;

        TileCanvas(int width, int height, java.util.Map<UUID, Ansi.Color> ownerColors) {
            this.tiles = new Tile[height][width];
            this.ownerColors = ownerColors;
        }

        void addTile(final Player player) {
            final Ansi.Color color = ownerColors.get(player.getOwner());
            addTile(player.getPosition(), PLAYER, color);
        }

        private void addTile(final Position position, final char character, final Ansi.Color color) {
            addTile(position, new Tile(character, color));
        }

        private void addTile(final Position position, Tile tile) {
            tiles[position.getY()][position.getX()] = tile;
        }

        void addTile(final SpawnPoint spawnPoint) {
            final Ansi.Color color = ownerColors.get(spawnPoint.getOwner());
            addTile(spawnPoint.getPosition(), SPAWN_POINT, color);
        }

        void addTile(final Collectable collectable) {
            addTile(collectable.getPosition(), COLLECTABLE);
        }

        void addTile(final Position outOfBoundsPosition) {
            addTile(outOfBoundsPosition, OUT_OF_BOUNDS_POSITION);
        }

        private void printTile(Ansi ansi, final Tile tile) {
            if (tile != null) {
                ansi
                        .fg(tile.getColor())
                        .a(tile.getCharacter());
            } else {
                ansi.a(' ');
            }
        }

        void print(Ansi ansi) {
            for (final Tile[] row : tiles) {
                for (final Tile tile : row) {
                    printTile(ansi, tile);
                }
                ansi.newline();
            }
        }
    }

    private static class Tile {
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
