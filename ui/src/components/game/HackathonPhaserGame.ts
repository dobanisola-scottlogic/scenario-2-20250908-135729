import Phaser from 'phaser';
import { ParsedGameResult } from '~/components/game/ParsedGameResult';
import { CollectableSpriteSheet } from '~/components/game/SpriteSheets/CollectableSpriteSheet';
import { MapSpriteSheet } from '~/components/game/SpriteSheets/MapSpriteSheet';
import { PlayerSpriteSheet } from '~/components/game/SpriteSheets/PlayerSpriteSheet';
import { SpawnSpriteSheet } from '~/components/game/SpriteSheets/SpawnSpriteSheet';
import { SpriteSheetDefinition } from '~/components/game/SpriteSheets/SpriteSheetDefinition';
import PlayerMovementUtils from '~/enums/PlayerMovement';
import { Cell } from '~/interfaces/Cell';
import { Collectable } from '~/interfaces/Collectable';
import { Player } from '~/interfaces/Player';

import { PlayerTravel } from './PlayerTravel';

export class HackathonPhaserGame extends Phaser.Game {
  private static readonly GameBackgroundGreen: string = '007600';

  constructor(
    public readonly gameData: ParsedGameResult,
    public readonly parentElementId: string
  ) {
    super({
      // Example Phaser config: change this to Hackathon-specific values: HAC-253, HAC-254, HAC-255
      type: Phaser.AUTO,
      backgroundColor: HackathonPhaserGame.GameBackgroundGreen,
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
  private players: Phaser.GameObjects.Sprite[] = [];

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
    spriteSheetRow = 0,
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
          {
            start:
              spriteSheetRow * spriteSheetDefinition.repeatsEvery +
              animation.start,
            end:
              spriteSheetRow * spriteSheetDefinition.repeatsEvery +
              animation.end,
          }
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

  addObstacles = (parsedGameData: ParsedGameResult) => {
    parsedGameData.constants.outOfBoundPositions.forEach((position) => {
      this.addSprite(
        position.x,
        position.y,
        this.mapSpriteSheet,
        MapSpriteSheet.IndexOfObstruction
      );
    });
  };

  addSpawnPoints = (parsedGameData: ParsedGameResult) => {
    parsedGameData.constants.spawnPoints.forEach((spawnPoint) => {
      this.addSprite(
        spawnPoint.cell.column,
        spawnPoint.cell.row,
        this.spawnSpriteSheet,
        spawnPoint.teamIndex * this.spawnSpriteSheet.repeatsEvery,
        spawnPoint.teamIndex
      );
    });
  };

  create = () => {
    this.addObstacles(this.gameData);

    this.addSpawnPoints(this.gameData);
  };

  addCollectables = (collectables: Collectable[]) => {
    if (collectables?.length > 0) {
      collectables.forEach((collectable: Collectable, index: number) => {
        const sprite = this.addSprite(
          collectable.position.x,
          collectable.position.y,
          this.collectableSpriteSheet,
          index * this.collectableSpriteSheet.repeatsEvery,
          index,
          collectable.id
        );

        // Spin that chicken drumstick!
        sprite.anims.play(this.collectableSpriteSheet.spinAnimation.key);

        // Keep track of the collectables so we can remove them later:
        this.collectables.push(sprite);
      });
    }
  };

  addPlayers = (players: Player[]) => {
    players?.forEach((player) => {
      if (player.teamIndex < 0) {
        throw `Player with id=${player.id} has no assigned team index`;
      }

      const sprite = this.addSprite(
        player.cell.column,
        player.cell.row,
        this.playerSpriteSheet,
        player.teamIndex * this.playerSpriteSheet.repeatsEvery,
        player.teamIndex,
        player.id
      );

      sprite.anims.play(this.playerSpriteSheet.activeAnimation.key);

      // Keep track of the players so we can remove them later:
      this.players.push(sprite);
    });
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

  movePlayers = (playersTravels: Map<number, PlayerTravel>) => {
    playersTravels.forEach((playerTravel, key) => {
      const player = this.players.find(
        (p) => p.getData(this.playerSpriteSheet.idKey) === key
      );

      if (player) {
        const targetCell = new Cell(
          playerTravel.position.x,
          playerTravel.position.y
        );

        player.angle = PlayerMovementUtils.getAngle(
          playerTravel.playerMovement
        );

        const duration = playerTravel.hasWrappedAroundMap
          ? 0
          : this.DefaultSpeed;

        this.tweens.add({
          targets: player,
          x: {
            value: targetCell.getCentreXPosition(),
            duration,
          },
          y: {
            value: targetCell.getCentreYPosition(),
            duration,
          },
        });
      }
    });
  };

  removePlayers = (playerIds: number[]) => {
    playerIds.forEach((id) => {
      const index = this.players.findIndex(
        (p) => p.getData(this.playerSpriteSheet.idKey) === id
      );

      if (index > -1) {
        this.players[index].anims.play(this.playerSpriteSheet.dieAnimation.key);

        this.players[index].destroy(true);
        this.players.splice(index, 1);
      }
    });
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

        this.addPlayers(delta.playersAdded);
        this.removePlayers(delta.playersDestroyed);
        this.movePlayers(delta.playersTravel);
      }

      this.phaseIndex++;
    }
  };
}
