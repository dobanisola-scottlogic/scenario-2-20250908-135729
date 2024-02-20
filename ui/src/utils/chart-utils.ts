/* Defaulting to max 400 for Y axis on collectables - game engine values are too high to make chart readable (See HAC-326) */
export const COLLECTABLES_MAX_SPAWN_NUMBER = 400;

export const COLLECTABLES_SCARCE = {
  colour: '#FFA856', // Orange
  count: 20,
  text: 'Scarce',
};
export const COLLECTABLES_PLENTIFUL = {
  colour: '#2EFF2E', // Green
  count: 100,
  text: 'Plentiful',
};

export const BELOW_SCARCE_COLOUR = '#FC625A'; // Red

export const getCollectableChartColour = (collectableCount: number) => {
  if (collectableCount >= COLLECTABLES_PLENTIFUL.count) {
    return COLLECTABLES_PLENTIFUL.colour;
  } else if (collectableCount >= COLLECTABLES_SCARCE.count) {
    return COLLECTABLES_SCARCE.colour;
  } else {
    return BELOW_SCARCE_COLOUR;
  }
};
