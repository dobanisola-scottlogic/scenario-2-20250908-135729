import { Grid } from '@mui/material';
import Chip from '@mui/material/Chip';
import { viewerStyles } from '~/components/commonStyles';
import { Game } from '~/interfaces/Game';
import { GameTeam } from '~/interfaces/GameTeam';
import { getGameTimeString, getTeamColour } from '~/utils/game-utils';
import { removeMilestoneBotPrefix } from '~/utils/milestone-utils';

interface GameDetailsProps {
  game: Game;
}

const GameDetails = ({ game }: GameDetailsProps) => {
  const { teams, gameTime, map } = game;
  const { name: mapName } = map;

  const getTeamChips = () => {
    return teams.map((team: GameTeam, index: number) => {
      const teamName = removeMilestoneBotPrefix(team.teamName);
      const teamColour = getTeamColour(index);
      const id = team.teamId ? `team-${team.teamId}` : `bot-${team.botId}`;

      return (
        <span data-testid={id} key={id}>
          {index > 0 && <span> vs </span>}
          <Chip
            label={teamName}
            sx={{ ...viewerStyles.chipStyles, backgroundColor: teamColour }}
          />
        </span>
      );
    });
  };

  return (
    <>
      <Grid item xs={12} md={2} sx={viewerStyles.chipItem}>
        <Chip label={`Map: ${mapName}`} sx={viewerStyles.chipStyles} />
      </Grid>
      <Grid item xs={12} md={8} sx={viewerStyles.chipItem}>
        {getTeamChips()}
      </Grid>
      <Grid item xs={12} md={2} sx={viewerStyles.chipItem}>
        <Chip
          label={getGameTimeString(gameTime)}
          sx={viewerStyles.chipStyles}
        />
      </Grid>
    </>
  );
};

export default GameDetails;
