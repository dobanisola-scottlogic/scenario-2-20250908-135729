import { GameTeam } from '~/interfaces/GameTeam';
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
