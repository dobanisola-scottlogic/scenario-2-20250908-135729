import { Container } from '@mui/material';
import { useState } from 'react';

import AddButton from '../../common/AddButton';
import SnackbarAlert from '../../common/SnackbarAlert';
import CreateGame from '../../popups/CreateGame';
import GameResultListTable from '../../tables/GameResultListTable';

interface GameResultListProps {
  hackathonId: string;
}

const GameResultList = ({ hackathonId }: GameResultListProps) => {
  const [isAddGameOpen, setIsAddGameOpen] = useState(false);
  const handleAddGameOpen = () => setIsAddGameOpen(true);

  return (
    <>
      <SnackbarAlert />

      <Container maxWidth={false} style={{ padding: '10px 0' }}>
        <AddButton onClick={handleAddGameOpen} text='Add a new game' />
        <CreateGame
          isOpen={isAddGameOpen}
          hackathonId={hackathonId}
          setIsOpen={setIsAddGameOpen}
        />
        <GameResultListTable hackathonId={hackathonId} />
      </Container>
    </>
  );
};

export default GameResultList;
