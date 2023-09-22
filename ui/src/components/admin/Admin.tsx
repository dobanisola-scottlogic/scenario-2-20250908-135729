import { Button, Typography } from '@mui/material';
import { useState } from 'react';
import CreateUpdateHackathon from '../popups/CreateUpdateHackathon';
import DeleteHackathon from '../popups/DeleteHackathon';
import DeleteTeam from '../popups/DeleteTeam';

const Admin = () => {
  const [isCreateOpen, setIsCreateOpen] = useState<boolean>(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState<boolean>(false);

  const [isTeamDeleteOpen, setIsTeamDeleteOpen] = useState<boolean>(false);

  const handleDeleteOpen = () => setIsDeleteOpen(true);
  const handleCreateOpen = () => setIsCreateOpen(true);
  const handleTeamDeleteOpen = () => setIsTeamDeleteOpen(true);

  return (
    <>
      <Typography component="h1" variant="h6">
        Admin
      </Typography>

      <Button onClick={handleCreateOpen}>Create Hackathon</Button>
      <CreateUpdateHackathon
        isOpen={isCreateOpen}
        setIsOpen={setIsCreateOpen}
      />

      <Button onClick={handleDeleteOpen}>Delete Hackathon</Button>
      <DeleteHackathon
        isOpen={isDeleteOpen}
        id="test"
        setIsOpen={setIsDeleteOpen}
      />

      <Button onClick={handleTeamDeleteOpen}>Delete Team</Button>
      <DeleteTeam
        isOpen={isTeamDeleteOpen}
        id="test"
        setIsOpen={setIsTeamDeleteOpen}
      />
    </>
  );
};

export default Admin;
