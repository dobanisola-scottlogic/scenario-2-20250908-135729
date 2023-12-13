import Phaser from 'phaser';
import { useEffect, useRef } from 'react';
import { Game } from '~/interfaces/Game';

interface GamePlaybackProps {
  game: Game;
  height: number;
  width: number;
}

// Declare game variable outside of the component to ensure it is rendered once:
let game: Phaser.Game | null = null;
let cursors: Phaser.Types.Input.Keyboard.CursorKeys | null = null;
let player: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody | null = null;

const GamePlayback = ({
  game: hackathonGameData,
  height,
  width,
}: GamePlaybackProps) => {
  const gameRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Only create a new game if one doesn't already exist:
    if (!game) {
      // Example Phaser config: change this to Hackathon-specific values: HAC-253, HAC-254, HAC-255
      const config: Phaser.Types.Core.GameConfig = {
        type: Phaser.AUTO,
        height: height,
        width: width,
        parent: gameRef.current?.id,
        physics: {
          default: 'arcade',
          arcade: {
            gravity: { y: 200 },
          },
        },
        scene: {
          preload: preload,
          create: create,
          update: update,
        },
      };

      game = new Phaser.Game(config);
    }

    function preload(this: Phaser.Scene) {
      // Example Phaser preload: change this to Hackathon-specific values: HAC-253, HAC-254, HAC-255
      this.load.setBaseURL('https://labs.phaser.io');
      this.load.image('sky', 'assets/skies/space3.png');
      this.load.image('ground', 'assets/sprites/platform.png');
      this.load.image('logo', 'assets/sprites/phaser3-logo.png');
      this.load.image('red', 'assets/particles/red.png');
      this.load.spritesheet('dude', 'assets/sprites/dude.png', {
        frameWidth: 32,
        frameHeight: 48,
      });
    }

    function create(this: Phaser.Scene) {
      // Example Phaser create: change this to Hackathon-specific values: HAC-253, HAC-254, HAC-255
      this.add.image(640, 320, 'sky');

      const particles = this.add.particles(0, 0, 'red', {
        speed: 100,
        scale: { start: 1, end: 0 },
        blendMode: 'ADD',
      });

      const logo = this.physics.add.image(400, 100, 'logo');

      logo.setVelocity(100, 200);
      logo.setBounce(0.75, 0.75);
      logo.setCollideWorldBounds(true);

      particles.startFollow(logo);

      const platforms = this.physics.add.staticGroup();

      // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
      platforms.create(250, 750, 'ground').setScale(5).refreshBody();

      platforms.create(600, 400, 'ground');
      platforms.create(50, 250, 'ground');
      platforms.create(1200, 220, 'ground');

      player = this.physics.add.sprite(100, 450, 'dude');

      player.setBounce(0.2);
      player.setCollideWorldBounds(true);

      this.anims.create({
        key: 'left',
        frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
        frameRate: 10,
        repeat: -1,
      });

      this.anims.create({
        key: 'turn',
        frames: [{ key: 'dude', frame: 4 }],
        frameRate: 20,
      });

      this.anims.create({
        key: 'right',
        frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
        frameRate: 10,
        repeat: -1,
      });

      this.physics.add.collider(player, platforms);
      this.physics.add.collider(logo, platforms);
      this.physics.add.collider(logo, player);

      cursors = this.input.keyboard!.createCursorKeys();
    }

    function update(this: Phaser.Scene) {
      // Example Phaser update: change this to Hackathon-specific values!
      if (cursors!.left.isDown) {
        player!.setVelocityX(-160);
        player!.anims.play('left', true);
      } else if (cursors!.right.isDown) {
        player!.setVelocityX(160);

        player!.anims.play('right', true);
      } else {
        player!.setVelocityX(0);

        player!.anims.play('turn');
      }

      if (cursors!.up.isDown && player!.body.touching.down) {
        player!.setVelocityY(-330);
      }
    }
  }, [hackathonGameData, height, width]);

  return (
    <div style={{ minHeight: height, minWidth: width, textAlign: 'center' }}>
      {hackathonGameData && (
        <div
          ref={gameRef}
          id='game-container'
          data-testid='game-playback-container'
        />
      )}
    </div>
  );
};

export default GamePlayback;
