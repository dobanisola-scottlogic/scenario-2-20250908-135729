
let COLOURS = require('./colours.js');

/*
 *  LICENSE INFORMATION FOR SPRITES
 *
 *  Player:
 *    - Zombie(online):
 *        -> Team colouring is custom
 *
 *  Spawn:
 *    - Portal(online):
 *        -> Team colouring is custom
 *
 *  Map:
 *    - Lava(custom):
 *    - Dirt(online):
 *
 *  Collectables:
 *    - Bone(online):
 *
 */

class StaticSprite {
    constructor(identifier, filePath, tileCount, width, height, colourMap) {
        this.IDENTIFIER = identifier;
        this.FILE_PATH = filePath;
        this.TILE_COUNT = tileCount;
        this.WIDTH = width;
        this.HEIGHT = height;
        this.COLOUR_MAP = colourMap;
    }
}

class StaticSpriteBuilder {
    constructor() {
        this.identifier = null;
        this.tileCount = null;
        this.width = null;
        this.height = null;
        this.colourMap = null;

        this.animations = null;
        this.teamSpriteCount = null;

        return this;
    }
    get() {

        // Create colour map
        if (this.animations && !this.colourMap) {
            if (this.teamSpriteCount) {
                this.generateColourMap(COLOURS.TEAM_COLOURS);
            } else {
                this.generateColourMap();
            }
        }

        let staticSprite = null;
        if (this.identifier &&
            this.tileCount &&
            this.width &&
            this.height &&
            this.colourMap) {
            staticSprite = new StaticSprite(this.identifier,
                                            './assets/' + this.identifier + '.png',
                                            this.tileCount,
                                            this.width,
                                            this.height,
                                            this.colourMap);
        }
        return staticSprite;
    }
    generateAnimationSet(offsetCount) {
        var animationSet = {};
        for (let member in this.animations) {
            if (this.animations.hasOwnProperty(member)) {
                animationSet[member] = this.animations[member] + offsetCount;
            }
        }
        return animationSet;
    }
    generateColourMap(colours) {
        this.colourMap = {};
        if (colours) {
            for (let member in colours) {
                if (colours.hasOwnProperty(member)) {
                    let colour = colours[member];
                    this.colourMap[colour.ID] = this.generateAnimationSet(colour.INDEX * this.teamSpriteCount);
                }
            }
        } else {
            this.colourMap[COLOURS.NONE.ID] = this.generateAnimationSet(0);
        }
    }
    setIdentifier(value) {
        this.identifier = value;
        return this;
    }
    setTileCount(value) {
        this.tileCount = value;
        return this;
    }
    setWidth(value) {
        this.width = value;
        return this;
    }
    setHeight(value) {
        this.height = value;
        return this;
    }
    setAnimations(value) {
        this.animations = value;
        return this;
    }
    setTeamSpriteCount(value) {
        this.teamSpriteCount = value;
        return this;
    }
}

const SPRITE = {
    MAP: (new StaticSpriteBuilder()
            .setIdentifier('sheet_map')
            .setTileCount(2)
            .setWidth(20)
            .setHeight(20)
            .setAnimations({ CLEAR: 0,
                             OBSTRUCTION: 1 })
            .get()),

    PLAYER: new StaticSpriteBuilder()
                .setIdentifier('sheet_player')
                .setTileCount(216)
                .setWidth(48)
                .setHeight(48)
                .setAnimations({ DEFAULT: 4,
                                 STAND: 0,
                                 RUN: 4,
                                 SLAM: 12,
                                 BITE: 16,
                                 BLOCK: 20,
                                 HIT_AND_DIE: 22,
                                 DIE: 28 })
                .setTeamSpriteCount(36)
                .get(),

    SPAWN: new StaticSpriteBuilder()
               .setIdentifier('sheet_spawn')
               .setTileCount(108)
               .setWidth(64)
               .setHeight(64)
               .setAnimations({ DEFAULT: 0,
                                DIE: 11 })
               .setTeamSpriteCount(18)
               .get(),

    COLLECTABLE: new StaticSpriteBuilder()
                     .setIdentifier('sheet_collectable')
                     .setTileCount(15)
                     .setWidth(64)
                     .setHeight(64)
                     .setAnimations({ DEFAULT: 0,
                                      DIE: 8 })
                     .get()
};

module.exports = SPRITE;
