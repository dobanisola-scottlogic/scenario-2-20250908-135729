import { useState } from 'react';

import AddButton from '~/components/common/AddButton';
import { CommonContainer } from '~/components/common/CommonContainer';
import TeamDataGrid from '~/components/dataGrids/TeamDataGrid';
import CreateUpdateTeam from '~/components/popups/CreateUpdateTeam';
import { ContainerRole } from '~/enums/ContainerRole';

interface TeamListProps {
  hackathonId: string;
}

const TeamList = ({ hackathonId }: TeamListProps) => {
  const [isAddTeamOpen, setIsAddTeamOpen] = useState(false);
  const handleAddTeamOpen = () => setIsAddTeamOpen(true);

  return (
    <>
      <CommonContainer containerRole={ContainerRole.LIST}>
        <AddButton onClick={handleAddTeamOpen} text='Add a new team' />
        <CreateUpdateTeam
          isOpen={isAddTeamOpen}
          hackathonId={hackathonId}
          setIsOpen={setIsAddTeamOpen}
        />
        <TeamDataGrid hackathonId={hackathonId} />
      </CommonContainer>
    </>
  );
};

export default TeamList;
