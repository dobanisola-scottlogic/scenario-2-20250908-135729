import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import { Box, Button, Container, Typography } from '@mui/material';
import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../../hooks';
import {
  selectSnackbarState,
  setSnackbarState,
} from '../../../slices/snackbarSlice';
import SnackbarAlert from '../../common/SnackbarAlert';
import DeleteTeam from '../../popups/DeleteTeam';

const HackathonDetails = () => {
  const dispatch = useAppDispatch();

  const { id } = useParams();
  // TODO: on HAC-75 make API call to get hackathon by id and replace the id with name in header below
  // and move the delete team button as per UX designs

  const [isDeleteTeamOpen, setIsDeleteTeamOpen] = useState(false);
  const handleDeleteTeamOpen = () => setIsDeleteTeamOpen(true);

  const snackbarState = useAppSelector(selectSnackbarState);
  const setShowHackathonSnackbar = (isOpen: boolean) => {
    dispatch(setSnackbarState({ isOpen, message: snackbarState.message }));
  };

  return (
    <>
      <SnackbarAlert
        isSnackbarOpen={snackbarState.isOpen}
        popupMessage={snackbarState.message}
        setShowSnackbar={setShowHackathonSnackbar}
      />

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
        <Button onClick={handleDeleteTeamOpen}>Delete Team</Button>
        <DeleteTeam
          isOpen={isDeleteTeamOpen}
          id="5a610af8-4d9d-49d0-a927-72c43f245df9"
          setIsOpen={setIsDeleteTeamOpen}
        />
      </Container>
    </>
  );
};

export default HackathonDetails;
