// These map names are a direct analogue of the file names found in the 'game-engine/src/resources/maps' directory.
// Hard-coded for now as there is currently no map service.
function MapOption(display, value, isDefault) {
    return {display, value, isDefault};
}
const maps = [new MapOption('Very Easy', 'VeryEasy'),
    new MapOption('Easy', 'Easy', true),
    new MapOption('Medium', 'Medium'),
    new MapOption('Large Medium', 'LargeMedium'),
    new MapOption('Hard', 'Hard')];

module.exports = maps;
