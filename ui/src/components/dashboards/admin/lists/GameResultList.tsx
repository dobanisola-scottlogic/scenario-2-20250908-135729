import { useState } from 'react';
import AddButton from '~/components/common/AddButton';
import { CommonContainer } from '~/components/common/CommonContainer';
import GameResultDataGrid from '~/components/dataGrids/GameResultDataGrid';
import CreateGame from '~/components/popups/CreateGame';
import { ContainerRole } from '~/enums/ContainerRole';

interface GameResultListProps {
  hackathonId: string;
}

const GameResultList = ({ hackathonId }: GameResultListProps) => {
  const [isAddGameOpen, setIsAddGameOpen] = useState(false);
  const handleAddGameOpen = () => setIsAddGameOpen(true);

  return (
    <>
      <CommonContainer containerRole={ContainerRole.LIST}>
        <AddButton onClick={handleAddGameOpen} text='Add a new game' />
        <CreateGame
          isOpen={isAddGameOpen}
          hackathonId={hackathonId}
          setIsOpen={setIsAddGameOpen}
        />
        <GameResultDataGrid hackathonId={hackathonId} openLinksInNewTab />
      </CommonContainer>
    </>
  );
};

export default GameResultList;
