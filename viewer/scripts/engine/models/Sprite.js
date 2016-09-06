
let PHASER = require('../../enums/phaser.js');
let SPRITE = require('../../enums/sprite.js');
let MOVEMENT = require('../../enums/movement.js');
let COLOURS = require('../../enums/colours.js');

let Cell = require('./Cell.js');

class Sprite {
    constructor(game, staticSprite, width, height, cell, colour) {
        this.game = game;
        this.width = width;
        this.height = height;
        this.staticSprite = staticSprite;
        this.colour = colour;
        this.colourMap = staticSprite.COLOUR_MAP[colour.ID];
        this.sprite = this.constructSprite(staticSprite, cell);
        this.pauseCache = null;
    }
    copySpriteToCell(cell) {
        let clone = new Sprite(this.game,
                               this.staticSprite,
                               this.width,
                               this.height,
                               cell,
                               this.colour);
        clone.sprite.angle = this.sprite.angle;
        Object.keys(this.sprite.animations).forEach((animation) => {
            let clonedAnimation = clone.sprite.animations.add(animation.name,
                                                              animation._frames,
                                                              PHASER.A_SECOND / animation.delay,
                                                              animation.loop);
        });
        if (this.sprite.currentAnim &&
            this.sprite.currentAnim.name) {
            clone.sprite.playAnimation(this.sprite.currentAnim.name);
        }
        return clone;
    }
    constructSprite(staticSprite, cell) {
        let defaultFrame = this.colourMap.DEFAULT ? this.colourMap.DEFAULT.START : 0;
        let sprite = this.game.add.sprite(cell.getCentreXPosition(),
                                          cell.getCentreYPosition(),
                                          staticSprite.IDENTIFIER,
                                          defaultFrame);
        sprite.width = PHASER.CELL.WIDTH * this.width;
        sprite.height = PHASER.CELL.HEIGHT * this.height;
        sprite.anchor.setTo(0.5, 0.5);
        this.game.physics.enable(sprite);
        return sprite;
    }
    getAngle(direction) {
        switch (direction) {
        case MOVEMENT.NORTH:
            return 0;
        case MOVEMENT.NORTHEAST:
            return 45;
        case MOVEMENT.EAST:
            return 90;
        case MOVEMENT.SOUTHEAST:
            return 135;
        case MOVEMENT.SOUTH:
            return 180;
        case MOVEMENT.SOUTHWEST:
            return 225;
        case MOVEMENT.WEST:
            return 270;
        case MOVEMENT.NORTHWEST:
            return 315;
        }
        return 0;
    }
    setTranslate(delay, cell) {
        this.game.physics.arcade.moveToXY(this.sprite,
                                          cell.getCentreXPosition(),
                                          cell.getCentreYPosition(),
                                          1,
                                          delay);
    }
    setVelocity(xVelocity, yVelocity) {
        if (this.sprite.body) {
            this.sprite.body.velocity.setTo(xVelocity, yVelocity);
        }
    }
    addAnimation(id) {
        let frames = [];
        let newAnimation = null;
        let staticAnimation = Array.from(Object.keys(this.colourMap), key => this.colourMap[key])
                                   .filter(colour => colour.ID === id)[0];
        if (staticAnimation) {
            for (let frameIndex = staticAnimation.START; frameIndex <= staticAnimation.END; frameIndex ++) {
                frames.push(frameIndex);
            }
            newAnimation = this.sprite.animations.add(staticAnimation.ID, frames, staticAnimation.FRAME_RATE, staticAnimation.IS_LOOP);
        }
        return newAnimation;
    }
    playAnimation(id) {
        let staticAnimation = Array.from(Object.keys(this.colourMap), key => this.colourMap[key])
                                   .filter(colour => colour.ID === id)[0];
        let animationSpeed = Math.max(Math.ceil(staticAnimation.FRAME_RATE * this.game.playbackSpeed), 1);
        this.sprite.animations.play(id, animationSpeed);
    }
    stopAnimation(id) {
        this.sprite.animations.stop(null, true);
    }
    setDirection(direction) {
        // Magic number to fix player sprite orientation; time consuming to fix sprite
        this.sprite.angle = this.getAngle(direction) + 135;
    }
    setCell(cell) {
        this.sprite.x = cell.getCentreXPosition();
        this.sprite.y = cell.getCentreYPosition();
    }
    adjustVelocity(phaseDelay, newPhaseDelay) {
        let workingVelocityX = 0.0 + this.pauseCache ? this.pauseCache.velocity.x : this.sprite.body.velocity.x;
        let workingVelocityY = 0.0 + this.pauseCache ? this.pauseCache.velocity.y : this.sprite.body.velocity.y;
        let newVelocityX = workingVelocityX * phaseDelay / newPhaseDelay;
        let newVelocityY = workingVelocityY * phaseDelay / newPhaseDelay;
        this.setVelocity(newVelocityX, newVelocityY);
    }
    adjustPlaybackSpeed(phaseDelay, newPhaseDelay) {
        if (this.sprite.animations.currentAnim) {
            this.sprite.animations.currentAnim.delay /= phaseDelay / newPhaseDelay;
        }
    }
    setPaused(pause, phaseDelay) {
        if (pause) {
            this.pauseCache = {
                velocity: {
                    x: this.sprite.body ? this.sprite.body.velocity.x : 0,
                    y: this.sprite.body ? this.sprite.body.velocity.y : 0
                },
                phaseDelay: phaseDelay
            };
            if (this.sprite.currentAnim) {
                this.sprite.animations.paused = true;
            }
            this.setVelocity(0, 0);
        } else if (this.pauseCache) {
            this.adjustPlaybackSpeed(this.pauseCache.phaseDelay, phaseDelay);
            this.adjustVelocity(this.pauseCache.phaseDelay, phaseDelay);
            if (this.sprite.currentAnim) {
                this.sprite.animations.paused = false;
            }
            this.pauseCache = null;
        } else {
            console.log('ERROR : Attempted to resume pause state of an item which was never paused.');
        }
    }
    destroy(playDeathAnimation, leavePhaserSprite) {
        let dieAnimation = this.sprite.animations.getAnimation('die');
        this.setVelocity(0, 0);
        if (dieAnimation && playDeathAnimation) {
            dieAnimation.onComplete.add((sprite) => {
                if (!leavePhaserSprite) {
                    sprite.destroy();
                } else {
                    this.sprite.width *= 2;
                    this.sprite.height *= 2;
                }
            });
            dieAnimation.play();
        } else if (!leavePhaserSprite) {
            this.sprite.destroy();
        }
    }
}

module.exports = Sprite;
