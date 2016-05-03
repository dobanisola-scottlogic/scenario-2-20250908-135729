let constants = require('./models/constants');
let state = require('./models/state');
let delta = require('./models/delta');

function preprocessJson(gameData) {
    let startTime = performance.now();
    let parsedObjects = {
        constants: constants.parse(gameData),
        state: state.parseEnumerable(gameData),
        deltas: delta.parseEnumerable(gameData)
    };
    let finishTime = performance.now();

    console.log('Parsing took', Math.round(finishTime - startTime), 'milliseconds!');

    return parsedObjects;
}

module.exports = preprocessJson;
