import { testGameResultBody } from '~/mocks/test-data/game';
import { colours, playerColours } from '~/theme';
import { getGameTimeString, getGameTitle, getTeamColour } from './game-utils';

describe('getTeamColour', () => {
  it('should return the matching colour when provided a player index between 0 - 3', () => {
    expect(getTeamColour(0)).toEqual(playerColours[0]);
    expect(getTeamColour(1)).toEqual(playerColours[1]);
    expect(getTeamColour(2)).toEqual(playerColours[2]);
    expect(getTeamColour(3)).toEqual(playerColours[3]);
  });

  it('should return a default colour when provided an out of bounds index', () => {
    expect(getTeamColour(50)).toEqual(colours.darkGrey);
  });
});

describe('getGameTimeString', () => {
  it('should return an empty string for null input', () => {
    const input = null;
    const expectedOutput = '';
    expect(getGameTimeString(input)).toEqual(expectedOutput);
  });

  it('should format the game time correctly', () => {
    const input = Date.parse('13 Oct 2023 09:12:34');
    const expectedOutput = 'Fri, 09:12:34';
    expect(getGameTimeString(input)).toEqual(expectedOutput);
  });
});

describe('getGameTitle', () => {
  it('should return a string with the team names separated by "vs"', () => {
    expect(getGameTitle(testGameResultBody.game.teams)).toEqual(
      'Milestone1Bot vs Milestone2Bot'
    );
  });
});
