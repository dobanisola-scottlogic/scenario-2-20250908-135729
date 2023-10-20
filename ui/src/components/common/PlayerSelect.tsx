import {
  FormControl,
  InputLabel,
  ListSubheader,
  MenuItem,
  Select,
} from '@mui/material';
import { skipToken } from '@reduxjs/toolkit/query/react';

import {
  useGetHackathonTeamsQuery,
  useGetMilestonesQuery,
} from '../../api/api';

interface PlayerSelectProps {
  hackathonId: string;
  includeTeams: boolean;
  isOptional: boolean;
  playerName: string;
  playerNumber: number;
  setPlayerName: (name: string) => void;
}

const PlayerSelect = ({
  hackathonId,
  includeTeams,
  isOptional,
  playerName,
  playerNumber,
  setPlayerName,
}: PlayerSelectProps) => {
  const { data: milestoneBots } = useGetMilestonesQuery();
  const { data: teams } = useGetHackathonTeamsQuery(
    includeTeams ? hackathonId : skipToken
  );

  return (
    <FormControl sx={{ m: 1, mx: 'auto' }} fullWidth>
      <InputLabel id={`player-${playerNumber}-select-label`}>
        {`Select player ${playerNumber} ${
          isOptional ? '(Optional)' : ''
        }`.trim()}
      </InputLabel>

      <Select
        data-testid={`player-${playerNumber}`}
        id={`player-${playerNumber}`}
        label={`Select player ${playerNumber} ${
          isOptional ? '(Optional)' : ''
        }`.trim()}
        labelId={`player-${playerNumber}-select-label`}
        value={playerName}
        onChange={(event) => setPlayerName(event.target.value)}
      >
        {isOptional && (
          <MenuItem value=''>
            <em>None</em>
          </MenuItem>
        )}

        {/* Rendering the ListSubheader and MenuItem elements separately avoids the "Fragment as child" error: */}
        {includeTeams && <ListSubheader>Teams</ListSubheader>}

        {includeTeams &&
          teams?.map((bot) => (
            <MenuItem key={bot.id} value={bot.name}>
              {bot.name}
            </MenuItem>
          ))}

        <ListSubheader>Milestones</ListSubheader>
        {milestoneBots?.map((bot) => (
          <MenuItem key={bot.id} value={bot.milestoneClassName}>
            {bot.readableMilestoneClassName}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default PlayerSelect;
