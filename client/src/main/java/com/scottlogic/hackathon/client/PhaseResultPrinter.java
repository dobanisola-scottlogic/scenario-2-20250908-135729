package com.scottlogic.hackathon.client;

import com.scottlogic.hackathon.game.Bot;
import com.scottlogic.hackathon.game.Collectable;
import com.scottlogic.hackathon.game.PhaseResult;
import com.scottlogic.hackathon.game.Player;
import com.scottlogic.hackathon.game.Position;
import com.scottlogic.hackathon.game.SpawnPoint;
import com.scottlogic.hackathon.game.engine.maps.PlayableMap;
import org.fusesource.jansi.Ansi;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

public class PhaseResultPrinter {
    private static final Ansi.Color[] COLORS = new Ansi.Color[]{
            Ansi.Color.GREEN,
            Ansi.Color.BLUE,
            Ansi.Color.YELLOW,
            Ansi.Color.MAGENTA
    };

    private static final List<Tile> PLAYERS = IntStream.range(0, COLORS.length)
            .mapToObj(i -> new Tile((char)('a' + i), COLORS[i]))
            .collect(Collectors.toList());

    private static final List<Tile> SPAWN_POINTS = IntStream.range(0, COLORS.length)
            .mapToObj(i -> new Tile((char)('A' + i), COLORS[i]))
            .collect(Collectors.toList());

    private static final Tile COLLECTABLE = new Tile('+', Ansi.Color.WHITE);
    private static final Tile OUT_OF_BOUNDS_POSITION = new Tile('X', Ansi.Color.RED);
    private static final char SEPARATOR = '-';
    private final Set<Bot> bots;
    private final PlayableMap map;
    private final List<UUID> ownerIndices;
    private final char[] seperator;

    public PhaseResultPrinter(final Set<Bot> bots, final PlayableMap map) {
        this.bots = bots;
        this.map = map;

        this.ownerIndices = Collections.unmodifiableList(bots.stream().map(Bot::getId).collect(Collectors.toList()));

        this.seperator = new char[map.getWidth()];
        Arrays.fill(seperator, SEPARATOR);
    }


    public void print(PhaseResult phaseResult, int totalPhases) {
        TileCanvas tiles = new TileCanvas(map.getWidth(), map.getHeight(), ownerIndices);

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
            int index = ownerIndices.indexOf(bot.getId());
            ansi
                    .fg(COLORS[index])
                    .a(SPAWN_POINTS.get(index).character)
                    .a(" - ")
                    .a(String.format(bot.getDisplayName()))
                    .newline();
        }

        printSeparator(ansi);
        tiles.print(ansi);
        printSeparator(ansi);
        System.out.println(ansi);
    }

    private void printSeparator(Ansi ansi) {
        ansi
                .reset()
                .a(seperator)
                .newline();
    }

    private static class TileCanvas {
        private final List<UUID> ownerIndices;
        private final Tile[][] tiles;

        TileCanvas(int width, int height, List<UUID> ownerIndices) {
            this.tiles = new Tile[height][width];
            this.ownerIndices = ownerIndices;
        }

        void addTile(final Player player) {
            addTile(player.getPosition(), PLAYERS.get(ownerIndices.indexOf(player.getOwner())));
        }

        private void addTile(final Position position, Tile tile) {
            tiles[position.getY()][position.getX()] = tile;
        }

        void addTile(final SpawnPoint spawnPoint) {
            addTile(spawnPoint.getPosition(), SPAWN_POINTS.get(ownerIndices.indexOf(spawnPoint.getOwner())));
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
