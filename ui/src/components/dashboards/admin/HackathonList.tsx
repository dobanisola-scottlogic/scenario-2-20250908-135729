import { Box, Container } from '@mui/material';
import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../hooks';
import {
  selectSnackbarState,
  setSnackbarState,
} from '../../../slices/snackbarSlice';
import AddButton from '../../common/AddButton';
import SnackbarAlert from '../../common/SnackbarAlert';
import CreateUpdateHackathon from '../../popups/CreateUpdateHackathon';
import HackathonListTable from '../../tables/HackathonListTable';

const HackathonList = () => {
  const dispatch = useAppDispatch();

  const [isCreateHackathonOpen, setIsCreateHackathonOpen] = useState(false);
  const handleIsCreateHackathonOpen = () => setIsCreateHackathonOpen(true);

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
        <Box sx={{ mb: 4 }}>
          <AddButton
            onClick={handleIsCreateHackathonOpen}
            text="Add a new hackathon"
          />
        </Box>
        <HackathonListTable />
        <CreateUpdateHackathon
          isOpen={isCreateHackathonOpen}
          setIsOpen={setIsCreateHackathonOpen}
        />
      </Container>
    </>
  );
};

export default HackathonList;
