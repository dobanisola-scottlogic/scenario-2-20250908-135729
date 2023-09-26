import { Typography } from '@mui/material';
import { useAppSelector } from '../../../hooks';
import { selectTeamName } from '../../../slices/authSlice';

const Team = () => {
  const name = useAppSelector(selectTeamName);

  return (
    <>
      <Typography component="h1" variant="h6">
        Team: {name}
      </Typography>
    </>
  );
};

export default Team;
