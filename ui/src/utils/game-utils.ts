import { GameTeam } from '~/interfaces/GameTeam';
import { colours, playerColours } from '~/theme';
import { removeMilestoneBotPrefix } from './milestone-utils';

export const getGameTimeString = (
  gameTimeMilliseconds: number | null
): string => {
  if (!gameTimeMilliseconds) {
    return '';
  }

  const locale = 'en-GB';
  const date = new Date(gameTimeMilliseconds);

  const weekday = date.toLocaleString(locale, { weekday: 'short' });
  const time = date.toLocaleTimeString(locale);

  return `${weekday}, ${time}`;
};

export const getGameTitle = (teams: GameTeam[]): string =>
  teams.map((team) => removeMilestoneBotPrefix(team.teamName)).join(' vs ');

export const getTeamColour = (playerNumber: number): string => {
  if (playerNumber >= 0 && playerNumber < 4) {
    return playerColours[playerNumber];
  }

  return colours.darkGrey;
};
