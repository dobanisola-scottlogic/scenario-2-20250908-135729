
// Import static objects
let constructStaticSheet = (identifier, tileCount, width, height, animations, teamSpriteCount) => {
    if (!animations) { animations = {}; }
    const newStaticSheet = {
        IDENTIFIER: identifier,
        FILE_PATH: './assets/' + identifier + '.png',
        TILE_COUNT: tileCount,
        WIDTH: width,
        HEIGHT: height,
        ANIMATIONS: animations,
        getTeamIndexOfFrame: (originalIndex, teamIndex) => {
            if (teamSpriteCount) {
                return originalIndex + teamIndex * teamSpriteCount;
            } else {
                return originalIndex;
            }
        }
    };
    return newStaticSheet;
};

const SPRITE = {
    MAP: constructStaticSheet('sheet_map',
                              2,
                              20,
                              20,
                              { CLEAR: 0,
                                OBSTRUCTION: 1 }),
    PLAYER: constructStaticSheet('sheet_player',
                                 216,
                                 48,
                                 48,
                                 { DEFAULT: 4,
                                   STAND: 0,
                                   RUN: 4,
                                   SLAM: 12,
                                   BITE: 16,
                                   BLOCK: 20,
                                   HIT_AND_DIE: 22,
                                   DIE: 28 },
                                 36),
    SPAWN: constructStaticSheet('sheet_spawn',
                                108,
                                64,
                                64,
                                { DEFAULT: 0,
                                  DIE: 11 },
                                18),
    COLLECTABLE: constructStaticSheet('sheet_collectable',
                                      15,
                                      64,
                                      64,
                                      { DEFAULT: 0,
                                        DIE: 8 })
};

module.exports = SPRITE;
