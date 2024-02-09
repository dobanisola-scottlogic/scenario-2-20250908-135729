import {
  BELOW_SCARCE_COLOUR,
  COLLECTABLES_PLENTIFUL,
  COLLECTABLES_SCARCE,
  getCollectableChartColour,
} from './chart-utils';

describe('getCollectableChartColour', () => {
  it('should return the correct colour for the collectable count', () => {
    expect(getCollectableChartColour(0)).toEqual(BELOW_SCARCE_COLOUR);
    expect(getCollectableChartColour(20)).toEqual(COLLECTABLES_SCARCE.colour);
    expect(getCollectableChartColour(100)).toEqual(
      COLLECTABLES_PLENTIFUL.colour
    );
  });
});
