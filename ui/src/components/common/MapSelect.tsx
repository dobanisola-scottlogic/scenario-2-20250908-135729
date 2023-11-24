import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import { commonStyles } from '~/components/commonStyles';

interface MapSelectProps {
  labelText: string;
  mapName: string;
  required?: boolean;
  setMapName: (name: string) => void;
}

// Hardcoded options should be removed in future when HAC-100 and HAC-101 are implemented
const MapSelect = ({
  labelText,
  mapName,
  required,
  setMapName,
}: MapSelectProps) => {
  return (
    <FormControl fullWidth required={required} sx={commonStyles.spacingStyle}>
      <InputLabel id='game-map-label'>{labelText}</InputLabel>
      <Select
        data-testid='game-map'
        labelId='game-map-label'
        id='game-map'
        label={labelText}
        value={mapName}
        onChange={(event) => setMapName(event.target.value)}
      >
        <MenuItem value='VeryEasy'>Very Easy</MenuItem>
        <MenuItem value='Easy'>Easy</MenuItem>
        <MenuItem value='Medium'>Medium</MenuItem>
        <MenuItem value='LargeMedium'>Large Medium</MenuItem>
        <MenuItem value='Hard'>Hard</MenuItem>
        <MenuItem value='ThreeStar'>Three Star</MenuItem>
        <MenuItem value='ThreeStraight'>Three Straight</MenuItem>
      </Select>
    </FormControl>
  );
};

export default MapSelect;
