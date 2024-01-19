import { Colour } from '~/utils/colours';

export interface GameTeam {
  botId: number;
  colour?: Colour;
  teamId: string | null;
  teamName: string;
}
