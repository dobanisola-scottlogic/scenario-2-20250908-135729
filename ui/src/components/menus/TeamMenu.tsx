import { useState } from 'react';

import KebabMenu from '../common/KebabMenu';
import DeleteTeam from '../popups/DeleteTeam';

interface TeamMenuProps {
  selectedTeamId: string;
}

const TeamMenu = ({ selectedTeamId }: TeamMenuProps) => {
  const [isDeleteTeamOpen, setIsDeleteTeamOpen] = useState(false);

  const handleIsDeleteTeamOpen = () => {
    setIsDeleteTeamOpen(true);
  };

  const kebabMenuOptions = [
    { name: 'Delete...', onClick: handleIsDeleteTeamOpen },
  ];

  return (
    <>
      <KebabMenu options={kebabMenuOptions} />
      <DeleteTeam
        isOpen={isDeleteTeamOpen}
        id={selectedTeamId}
        setIsOpen={setIsDeleteTeamOpen}
      />
    </>
  );
};

export default TeamMenu;
