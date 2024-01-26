import Phaser from 'phaser';
import { ParsedGameResult } from '~/components/game/ParsedGameResult';
import { CollectableSpriteSheet } from '~/components/game/SpriteSheets/CollectableSpriteSheet';
import { MapSpriteSheet } from '~/components/game/SpriteSheets/MapSpriteSheet';
import { PlayerSpriteSheet } from '~/components/game/SpriteSheets/PlayerSpriteSheet';
import { SpawnSpriteSheet } from '~/components/game/SpriteSheets/SpawnSpriteSheet';
import { SpriteSheetDefinition } from '~/components/game/SpriteSheets/SpriteSheetDefinition';
import { Cell } from '~/interfaces/Cell';
import { Collectable } from '~/interfaces/Collectable';
import { Position } from '~/interfaces/Position';

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
  private readonly DefaultSpeed: number = 280;
  private readonly collectableSpriteSheet: CollectableSpriteSheet =
    new CollectableSpriteSheet();
  private readonly mapSpriteSheet: MapSpriteSheet = new MapSpriteSheet();
  private readonly playerSpriteSheet: PlayerSpriteSheet =
    new PlayerSpriteSheet();
  private readonly spawnSpriteSheet: SpawnSpriteSheet = new SpawnSpriteSheet();

  private readonly spriteSheets: SpawnSpriteSheet[];

  private collectables: Phaser.GameObjects.Sprite[] = [];
  private lastPhaseTime = 0;
  private phaseCount = 0;
  private phaseIndex = 0;

  constructor(public readonly gameData: ParsedGameResult) {
    super({ key: 'MainScene' });

    this.spriteSheets = [
      this.collectableSpriteSheet,
      this.mapSpriteSheet,
      this.playerSpriteSheet,
      this.spawnSpriteSheet,
    ];

    this.lastPhaseTime = Date.now() - this.DefaultSpeed;
    this.phaseCount = this.gameData.deltas.length;
  }

  addSprite = (
    x: number,
    y: number,
    spriteSheetDefinition: SpriteSheetDefinition,
    frameNumber: number,
    instanceId: number | null = null
  ): Phaser.GameObjects.Sprite => {
    const sprite = this.add.sprite(
      x * Cell.CellWidth,
      y * Cell.CellHeight,
      spriteSheetDefinition.identifier,
      frameNumber
    );

    // The displayHeight/displayWidth will scale the sprite to the correct dimensions:
    sprite.displayHeight = spriteSheetDefinition.displayHeight;
    sprite.displayWidth = spriteSheetDefinition.displayWidth;

    spriteSheetDefinition.animations.forEach((animation) => {
      sprite.anims.create({
        key: animation.key,
        frames: this.anims.generateFrameNumbers(
          spriteSheetDefinition.identifier,
          { start: animation.start, end: animation.end }
        ),
        frameRate: animation.frameRate,
        repeat: animation.repeat,
      });
    });

    // Set the instanceId on the sprite so we can use it to look it up later:
    if (instanceId != null) {
      sprite.setData(spriteSheetDefinition.idKey, instanceId);
    }

    return sprite;
  };

  preload = () => {
    this.spriteSheets.forEach((spriteSheet: SpriteSheetDefinition) => {
      this.load.spritesheet(spriteSheet.identifier, spriteSheet.url, {
        frameHeight: spriteSheet.spriteHeight,
        frameWidth: spriteSheet.spriteWidth,
      });
    });
  };

  scaffoldMapArea = (rowCount: number, columnCount: number) => {
    const tileGrid: number[][] = [];

    // Add 1 to rowCount to avoid black line at bottom
    // Tried starting at 1, but still get black line
    // Unsure why, but this fixes it for now.
    // Investigate in HAC-311
    for (let row = 0; row < rowCount + 1; row++) {
      const tileRow: number[] = [];

      for (let column = 0; column < columnCount; column++) {
        // Initialise all map squares to the index of the clear sprite tile:
        tileRow.push(MapSpriteSheet.IndexOfClear);
      }

      tileGrid.push(tileRow);
    }

    return tileGrid;
  };

  populateObstacles = (
    parsedGameData: ParsedGameResult,
    tileGrid: number[][]
  ) => {
    parsedGameData.constants.outOfBoundPositions.forEach(
      (position: Position) => {
        // Set this map square to the index of the obstruction sprite tile:
        tileGrid[position.y][position.x] = MapSpriteSheet.IndexOfObstruction;
      }
    );

    for (let row = 0; row < tileGrid.length; row++) {
      for (let column = 0; column <= tileGrid[row].length; column++) {
        this.addSprite(column, row, this.mapSpriteSheet, tileGrid[row][column]);
      }
    }
  };

  populateSpawnPoints = (parsedGameData: ParsedGameResult) => {
    parsedGameData.constants.spawnPoints.forEach((spawnPoint, index) => {
      const team = parsedGameData.constants.teams.find(
        (t) => t.botId === spawnPoint.owner
      );

      if (!team) {
        throw `No team matches the owner "${spawnPoint.owner}" for the spawn point`;
      }

      this.addSprite(
        spawnPoint.cell.column,
        spawnPoint.cell.row,
        this.spawnSpriteSheet,
        index * this.spawnSpriteSheet.repeatsEvery
      );
    });
  };

  create = () => {
    const tileGrid: number[][] = this.scaffoldMapArea(
      this.gameData.constants.height,
      this.gameData.constants.width
    );

    this.populateObstacles(this.gameData, tileGrid);

    this.populateSpawnPoints(this.gameData);
  };

  addCollectables = (collectables: Collectable[]) => {
    if (collectables?.length > 0) {
      collectables.forEach((collectable: Collectable, index: number) => {
        const sprite = this.addSprite(
          collectable.position.x,
          collectable.position.y,
          this.collectableSpriteSheet,
          index * this.collectableSpriteSheet.repeatsEvery,
          collectable.id
        );

        // Spin that chicken drumstick!
        sprite.anims.play(this.collectableSpriteSheet.spinAnimation.key);

        // Keep track of the collectables so we can remove them later:
        this.collectables.push(sprite);
      });
    }
  };

  removeCollectables = (collectedIds: number[]) => {
    if (collectedIds?.length > 0) {
      collectedIds.forEach((id: number) => {
        const index = this.collectables.findIndex(
          (c) => c.getData(this.collectableSpriteSheet.idKey) === id
        );

        if (index > -1) {
          this.collectables[index].anims.play(
            this.collectableSpriteSheet.collectedAnimation.key
          );
          this.collectables[index].destroy(true);
          this.collectables.splice(index, 1);
        }
      });
    }
  };

  update = () => {
    // todo: process changes on each turn: HAC-255
    if (this.phaseIndex === this.phaseCount) {
      // Check for looped, game over etc:
    }

    const dateTimeNow = Date.now();

    if (
      dateTimeNow - this.lastPhaseTime > this.DefaultSpeed &&
      this.phaseIndex < this.phaseCount
    ) {
      this.lastPhaseTime = dateTimeNow;

      const delta = this.gameData.deltas[this.phaseIndex];

      if (delta) {
        this.addCollectables(delta.collectablesAdded);

        this.removeCollectables(delta.collectablesCollected);
      }

      this.phaseIndex++;
    }
  };
}
