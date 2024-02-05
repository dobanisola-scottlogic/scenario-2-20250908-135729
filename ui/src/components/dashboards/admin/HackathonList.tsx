import { Box } from '@mui/material';
import { useState } from 'react';
import AddButton from '~/components/common/AddButton';
import { CommonContainer } from '~/components/common/CommonContainer';
import SnackbarAlert from '~/components/common/SnackbarAlert';
import HackathonDataGrid from '~/components/dataGrids/HackathonDataGrid';
import CreateUpdateHackathon from '~/components/popups/CreateUpdateHackathon';
import { ContainerRole } from '~/enums/ContainerRole';

const HackathonList = () => {
  const [isCreateHackathonOpen, setIsCreateHackathonOpen] = useState(false);
  const handleIsCreateHackathonOpen = () => setIsCreateHackathonOpen(true);

  return (
    <>
      <SnackbarAlert />

      <CommonContainer containerRole={ContainerRole.DASHBOARD}>
        <Box sx={{ mb: 4 }}>
          <AddButton
            onClick={handleIsCreateHackathonOpen}
            text='Add a new hackathon'
          />
        </Box>
        <HackathonDataGrid />
        <CreateUpdateHackathon
          isOpen={isCreateHackathonOpen}
          setIsOpen={setIsCreateHackathonOpen}
        />
      </CommonContainer>
    </>
  );
};

export default HackathonList;
