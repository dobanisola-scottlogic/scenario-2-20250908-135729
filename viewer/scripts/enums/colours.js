
let createStaticColour = (colour, hex, index) => {
    return {
        ID: colour,
        HEX: hex,
        INDEX: index
    };
};

const COLOURS = {
    NONE: createStaticColour('none', '#000000', 0),
    TEAM_COLOURS: {
        RED: createStaticColour('red', '#FF0000', 0),
        BLUE: createStaticColour('blue', '#0000FF', 1),
        PINK: createStaticColour('pink', '#FF00FF', 2),
        GREEN: createStaticColour('green', '#00FF00', 3),
        YELLOW: createStaticColour('yellow', '#FFFF00', 4),
        CYAN: createStaticColour('cyan', '#00FFFF', 5)
    }
};

module.exports = COLOURS;
