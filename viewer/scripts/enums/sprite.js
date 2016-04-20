
// Import static objects
let constructStaticSheet = (identifier, tileCount, width, height, specialIndexes) => {
    if (!specialIndexes) { specialIndexes = {}; }
    const newStaticSheet = {
        IDENTIFIER: identifier,
        FILE_PATH: '../assets/' + identifier + '.png',
        TILE_COUNT: tileCount,
        WIDTH: width,
        HEIGHT: height,
        INDEXES: specialIndexes
    };
    return newStaticSheet;
};

const SPRITE = {
    MAP: constructStaticSheet('sheet_map', 2, 64, 64, { CLEAR: 0, OBSTRUCTION: 1 }),
    PLAYER: constructStaticSheet('sheet_player', 6, 64, 64),
    SPAWN: constructStaticSheet('sheet_spawn', 6, 192, 192),
    COLLECTABLE: constructStaticSheet('sheet_collectable', 1, 64, 64)
};

module.exports = SPRITE;
