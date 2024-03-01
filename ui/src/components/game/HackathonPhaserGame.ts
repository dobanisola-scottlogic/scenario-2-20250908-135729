import Phaser from 'phaser';
import { GameEndState } from '~/components/game/GameEndState';
import { ParsedGameResult } from '~/components/game/ParsedGameResult';
import { ParsedGameState } from '~/components/game/ParsedGameState';
import { PlayerTravel } from '~/components/game/PlayerTravel';
import { CollectableSpriteSheet } from '~/components/game/SpriteSheets/CollectableSpriteSheet';
import { MapSpriteSheet } from '~/components/game/SpriteSheets/MapSpriteSheet';
import { PlayerSpriteSheet } from '~/components/game/SpriteSheets/PlayerSpriteSheet';
import { SpawnSpriteSheet } from '~/components/game/SpriteSheets/SpawnSpriteSheet';
import { SpriteSheetDefinition } from '~/components/game/SpriteSheets/SpriteSheetDefinition';
import { TeamStats } from '~/components/game/TeamStats';
import { GamePlaybackSpeedMultiplier } from '~/enums/GamePlaybackSpeedMultiplier';
import PlayerMovementUtils from '~/enums/PlayerMovement';
import { Cell } from '~/interfaces/Cell';
import { Collectable } from '~/interfaces/Collectable';
import { DisqualifiedBot } from '~/interfaces/DisqualifiedBot';
import { Player } from '~/interfaces/Player';
import { removeMilestoneBotPrefix } from '~/utils/milestone-utils';
import { SpawnPoint } from './SpawnPoint';

export class HackathonPhaserGame extends Phaser.Game {
  private static readonly GameBackgroundGreen: string = '007600';

  constructor(
    public readonly gameData: ParsedGameResult,
    public readonly parentElementId: string,
    setGameState: React.Dispatch<
      React.SetStateAction<ParsedGameState | undefined>
    >,
    setGameEndState: React.Dispatch<
      React.SetStateAction<GameEndState | undefined>
    >
  ) {
    super({
      // Example Phaser config: change this to Hackathon-specific values: HAC-253, HAC-254, HAC-255
      type: Phaser.AUTO,
      backgroundColor: HackathonPhaserGame.GameBackgroundGreen,
      height: gameData.constants.height * Cell.CellHeight,
      width: gameData.constants.width * Cell.CellWidth,
      parent: parentElementId,
      physics: {
        default: 'arcade',
        arcade: {
          gravity: { y: 0 },
          debug: false,
        },
      },
      scene: new HackathonPhaserScene(gameData, setGameState, setGameEndState),
    });
  }

  private getHackathonScene = (): HackathonPhaserScene | undefined => {
    const scene = this.scene.getScenes().shift();

    if (scene) {
      return scene as HackathonPhaserScene;
    }
  };

  public setPaused = (isPaused: boolean) => {
    this.getHackathonScene()?.setPaused(isPaused);
  };

  public setGamePlaybackSpeedMultiplier = (
    multiplier: GamePlaybackSpeedMultiplier
  ) => {
    this.getHackathonScene()?.setGamePlaybackSpeedMultiplier(multiplier);
  };
}

class HackathonPhaserScene extends Phaser.Scene {
  private static readonly idKey: string = 'id';
  private static readonly ownerIdKey: string = 'ownerId';

  private readonly DefaultSpeed: number = 280;
  private readonly collectableSpriteSheet: CollectableSpriteSheet =
    new CollectableSpriteSheet();
  private readonly mapSpriteSheet: MapSpriteSheet = new MapSpriteSheet();
  private readonly playerSpriteSheet: PlayerSpriteSheet =
    new PlayerSpriteSheet();
  private readonly spawnSpriteSheet: SpawnSpriteSheet = new SpawnSpriteSheet();
  private readonly spriteSheets: SpawnSpriteSheet[];

  private collectables: Phaser.GameObjects.Sprite[] = [];
  private gamePlaybackSpeedMultiplier: GamePlaybackSpeedMultiplier =
    GamePlaybackSpeedMultiplier.Times1;
  private lastPhaseTime = 0;
  private phaseCount = 0;
  private phaseIndex = 0;
  private players: Phaser.GameObjects.Sprite[] = [];
  private spawnPoints: Phaser.GameObjects.Sprite[] = [];

  constructor(
    public readonly gameData: ParsedGameResult,
    private setGameState: React.Dispatch<
      React.SetStateAction<ParsedGameState | undefined>
    >,
    private setGameEndState: React.Dispatch<
      React.SetStateAction<GameEndState | undefined>
    >
  ) {
    super({ key: 'Hackathon' });

    this.spriteSheets = [
      this.collectableSpriteSheet,
      this.mapSpriteSheet,
      this.playerSpriteSheet,
      this.spawnSpriteSheet,
    ];

    this.lastPhaseTime = Date.now() - this.getGameSpeed();
    this.phaseCount = this.gameData.deltas.length;
  }

  private getGameSpeed = (): number => {
    return this.DefaultSpeed / this.gamePlaybackSpeedMultiplier;
  };

  public setPaused = (isPaused: boolean) => {
    if (isPaused === true) {
      this.game.pause();
    } else {
      this.game.resume();
    }
  };

  public setGamePlaybackSpeedMultiplier = (
    gamePlaybackSpeedMultiplier: GamePlaybackSpeedMultiplier
  ) => {
    this.gamePlaybackSpeedMultiplier = gamePlaybackSpeedMultiplier;
  };

  addSprite = (
    x: number,
    y: number,
    spriteSheetDefinition: SpriteSheetDefinition,
    frameNumber: number,
    spriteSheetRow = 0,
    instanceId: number | null = null,
    ownerId: number | null = null
  ): Phaser.GameObjects.Sprite => {
    const targetCell = new Cell(x, y);

    const sprite = this.add.sprite(
      targetCell.getCentreXPosition(),
      targetCell.getCentreYPosition(),
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

    // Set the instanceId/ownerId on the sprite so we can use it to look it up later:
    if (instanceId != null || ownerId != null) {
      sprite.setData({
        [HackathonPhaserScene.idKey]: instanceId,
        [HackathonPhaserScene.ownerIdKey]: ownerId,
      });
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

  addSpawnPoints = (spawnPoints: SpawnPoint[]) => {
    spawnPoints.forEach((spawnPoint) => {
      const sprite = this.addSprite(
        spawnPoint.position.x,
        spawnPoint.position.y,
        this.spawnSpriteSheet,
        spawnPoint.teamIndex * this.spawnSpriteSheet.repeatsEvery,
        spawnPoint.teamIndex,
        spawnPoint.id
      );

      this.spawnPoints.push(sprite);
    });
  };

  create = () => {
    this.addObstacles(this.gameData);

    this.addSpawnPoints(this.gameData.constants.spawnPoints);
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
        player.id,
        player.owner
      );

      sprite.anims.play(this.playerSpriteSheet.activeAnimation.key);

      // Keep track of the players so we can remove them later:
      this.players.push(sprite);
    });
  };

  removeSprites = (
    ids: number[],
    sprites: Phaser.GameObjects.Sprite[],
    spriteSheet: SpriteSheetDefinition,
    key: string = HackathonPhaserScene.idKey
  ) => {
    ids?.forEach((id: number) => {
      const index = sprites.findIndex((c) => c.getData(key) === id);

      if (index > -1) {
        const sprite = sprites[index];

        if (sprite) {
          if (spriteSheet.hasRemoveAnimation) {
            sprite.anims.play(spriteSheet.removeAnimationKey);

            sprite.on('animationcomplete', () => {
              sprite.destroy(true);
            });
          } else {
            sprite.destroy(true);
          }
        }

        sprites.splice(index, 1);
      }
    });
  };

  removeCollectables = (collectedIds: number[]) => {
    this.removeSprites(
      collectedIds,
      this.collectables,
      this.collectableSpriteSheet
    );
  };

  movePlayers = (playersTravels: Map<number, PlayerTravel>) => {
    playersTravels.forEach((playerTravel, key) => {
      const player = this.players.find(
        (p) => p.getData(HackathonPhaserScene.idKey) === key
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
          : this.getGameSpeed();

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
    this.removeSprites(playerIds, this.players, this.playerSpriteSheet);
  };

  removePlayersOfDisqualifiedBots = (disqualifiedBots: DisqualifiedBot[]) => {
    if (disqualifiedBots?.length > 0) {
      const disqualifiedBotsIds = disqualifiedBots.map((bot) => bot.id);

      this.removeSprites(
        disqualifiedBotsIds,
        this.players,
        this.playerSpriteSheet,
        HackathonPhaserScene.ownerIdKey
      );
    }
  };

  removeSpawnPoints = (ids: number[]) => {
    this.removeSprites(ids, this.spawnPoints, this.spawnSpriteSheet);
  };

  update = () => {
    if (this.phaseIndex === this.phaseCount) {
      // Game Over:
      this.game.pause();

      const gameState = this.gameData.states[this.gameData.states.length - 1];

      const teamStats: TeamStats[] = this.gameData.constants.teams.map(
        (team, index) => {
          const teamInfo = gameState.teams.find((t) => t.owner === team.botId);

          return new TeamStats(
            index,
            removeMilestoneBotPrefix(team.teamName),
            teamInfo?.playerCount ?? 0,
            teamInfo?.spawnCount ?? 0,
            teamInfo?.disqualificationReason ?? ''
          );
        }
      );

      const gameEndState: GameEndState = new GameEndState(
        teamStats,
        this.gameData.constants.cutoffCondition
      );

      this.setGameEndState(gameEndState);

      return;
    }

    const dateTimeNow = Date.now();

    if (
      dateTimeNow - this.lastPhaseTime > this.getGameSpeed() &&
      this.phaseIndex < this.phaseCount
    ) {
      this.lastPhaseTime = dateTimeNow;

      this.setGameState(this.gameData.states[this.phaseIndex]);

      const delta = this.gameData.deltas[this.phaseIndex];

      if (delta) {
        this.addCollectables(delta.collectablesAdded);
        this.removeCollectables(delta.collectablesCollected);

        this.addPlayers(delta.playersAdded);
        this.removePlayers(delta.playersDestroyed);
        this.movePlayers(delta.playersTravel);
        this.removePlayersOfDisqualifiedBots(delta.disqualifiedBots);

        this.removeSpawnPoints(delta.spawnPointsDestroyed);
      }

      this.phaseIndex++;
    }
  };
}
