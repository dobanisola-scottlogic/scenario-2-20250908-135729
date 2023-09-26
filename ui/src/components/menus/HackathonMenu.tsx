import { useState } from 'react';
import KebabMenu from '../common/KebabMenu';
import CreateUpdateHackathon from '../popups/CreateUpdateHackathon';
import DeleteHackathon from '../popups/DeleteHackathon';

interface HackathonMenuProps {
  selectedHackathonId: string;
}

const HackathonMenu = ({ selectedHackathonId }: HackathonMenuProps) => {
  const [isDeleteHackathonOpen, setIsDeleteHackathonOpen] = useState(false);
  const [isEditHackathonOpen, setIsEditHackathonOpen] = useState(false);

  const handleIsDeleteHackathonOpen = () => {
    setIsDeleteHackathonOpen(true);
  };

  const handleIsEditHackathonOpen = () => {
    setIsEditHackathonOpen(true);
  };

  const kebabMenuOptions = [
    { name: 'Edit...', onClick: handleIsEditHackathonOpen },
    { name: 'Delete...', onClick: handleIsDeleteHackathonOpen },
  ];

  return (
    <>
      <KebabMenu options={kebabMenuOptions} />
      <DeleteHackathon
        isOpen={isDeleteHackathonOpen}
        id={selectedHackathonId}
        setIsOpen={setIsDeleteHackathonOpen}
      />
      <CreateUpdateHackathon
        id={selectedHackathonId}
        isOpen={isEditHackathonOpen}
        setIsOpen={setIsEditHackathonOpen}
      />
    </>
  );
};

export default HackathonMenu;
