import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import { Box, Container, Typography } from '@mui/material';
import { Link, useParams } from 'react-router-dom';

import SnackbarAlert from '../../common/SnackbarAlert';
import TeamList from './TeamList';

const HackathonDetails = () => {
  const { id } = useParams();
  // TODO: on HAC-75 make API call to get hackathon by id and replace the id with name in header below

  return (
    <>
      <SnackbarAlert />

      <Container maxWidth={false} style={{ padding: '40px 50px' }}>
        <Box>
          <Typography
            sx={{
              display: 'inline-flex',
            }}
          >
            <Link to={'/'}>Hackathons</Link>
            <KeyboardArrowRight fontSize="small" />
            {id}
          </Typography>
        </Box>
        <TeamList hackathonId={id!} />
      </Container>
    </>
  );
};

export default HackathonDetails;
