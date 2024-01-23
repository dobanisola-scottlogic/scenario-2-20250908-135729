import Phaser from 'phaser';
import { Cell } from '~/interfaces/Cell';
import { Position } from '~/interfaces/Position';

import { MapSpriteSheet } from './MapSpriteSheet';
import { ParsedGameResult } from './ParsedGameResult';
import { PlayerSpriteSheet } from './PlayerSpriteSheet';
import { SpawnSpriteSheet } from './SpawnSpriteSheet';

export class HackathonPhaserGame extends Phaser.Game {
  constructor(
    public readonly gameData: ParsedGameResult,
    public readonly parentElementId: string
  ) {
    super({
      // Example Phaser config: change this to Hackathon-specific values: HAC-253, HAC-254, HAC-255
      type: Phaser.AUTO,
      height: gameData.constants.height * Cell.CellHeight,
      width: gameData.constants.width * Cell.CellWidth,
      parent: parentElementId,
      scene: new HackathonPhaserScene(gameData),
    });
  }
}

class HackathonPhaserScene extends Phaser.Scene {
  constructor(public readonly gameData: ParsedGameResult) {
    super({ key: 'MainScene' });
  }

  preload = () => {
    this.load.spritesheet(
      MapSpriteSheet.Identifier,
      `/application/assets/${MapSpriteSheet.Identifier}.png`,
      {
        frameHeight: MapSpriteSheet.SpriteHeight,
        frameWidth: MapSpriteSheet.SpriteWidth,
      }
    );

    this.load.spritesheet(
      PlayerSpriteSheet.Identifier,
      `/application/assets/${PlayerSpriteSheet.Identifier}.png`,
      {
        frameHeight: PlayerSpriteSheet.SpriteHeight,
        frameWidth: PlayerSpriteSheet.SpriteWidth,
      }
    );

    this.load.spritesheet(
      SpawnSpriteSheet.Identifier,
      `/application/assets/${SpawnSpriteSheet.Identifier}.png`,
      {
        frameHeight: SpawnSpriteSheet.SpriteHeight,
        frameWidth: SpawnSpriteSheet.SpriteWidth,
      }
    );
  };

  scaffoldMapArea(rowCount: number, columnCount: number) {
    const tileGrid: number[][] = [];

    for (let row = 0; row < rowCount; row++) {
      const tileRow: number[] = [];

      for (let column = 0; column < columnCount; column++) {
        // Initialise all map squares to the index of the clear sprite tile:
        tileRow.push(MapSpriteSheet.IndexOfClear);
      }

      tileGrid.push(tileRow);
    }

    return tileGrid;
  }

  populateObstacles(parsedGameData: ParsedGameResult, tileGrid: number[][]) {
    parsedGameData.constants.outOfBoundPositions.forEach(
      (position: Position) => {
        // Set this map square to the index of the obstruction sprite tile:
        tileGrid[position.y][position.x] = MapSpriteSheet.IndexOfObstruction;
      }
    );

    for (let row = 0; row < tileGrid.length; row++) {
      for (let column = 0; column <= tileGrid[row].length; column++) {
        const sprite = this.add.sprite(
          column * Cell.CellWidth, // x coordinate
          row * Cell.CellHeight, // y coordinate
          MapSpriteSheet.Identifier, // map sprite sheet identifier
          tileGrid[row][column] // Which frame in the sprite sheet to set as this sprite
        );

        sprite.scale = 0.5; // Ensures the whole frame of the sprite is used
        sprite.setOrigin(0.5, 0.5);
      }
    }
  }

  populateSpawnPoints(parsedGameData: ParsedGameResult) {
    parsedGameData.constants.spawnPoints.forEach((spawnPoint, index) => {
      const team = parsedGameData.constants.teams.find(
        (t) => t.botId === spawnPoint.owner
      );

      if (!team) {
        throw `No team matches the owner "${spawnPoint.owner}" for the spawn point`;
      }

      const sprite = this.add.sprite(
        spawnPoint.cell.column * Cell.CellWidth,
        spawnPoint.cell.row * Cell.CellHeight,
        SpawnSpriteSheet.Identifier,
        index * 18, // index of sprites in this sprite map are 0, 18, 36, 54, 72, 90
      );

      sprite.displayHeight = Cell.CellHeight * SpawnSpriteSheet.DisplayHeight;
      sprite.displayWidth = Cell.CellWidth * SpawnSpriteSheet.DisplayWidth;

      // Set to center of frame:
      sprite.setOrigin(0.5, 0.5);
    });
  }

  create = () => {
    // Scaffold the map area:
    const tileGrid: number[][] = this.scaffoldMapArea(
      this.gameData.constants.height,
      this.gameData.constants.width
    );

    this.populateObstacles(this.gameData, tileGrid);

    this.populateSpawnPoints(this.gameData);
  };

  update = () => {
    // todo: process changes on each turn: HAC-255
  };
}
