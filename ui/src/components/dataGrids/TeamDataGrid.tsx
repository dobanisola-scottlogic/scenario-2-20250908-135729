import { GridRenderCellParams } from '@mui/x-data-grid';

import { useGetHackathonTeamsQuery } from '~/api/api';
import ListDataGrid from '~/components/common/ListDataGrid';
import TeamMenu from '~/components/menus/TeamMenu';
import { Team } from '~/interfaces/Team';
import { actionColumn } from '~/utils/common-columns';

interface TeamDataGridProps {
  hackathonId: string;
}

interface TeamRowType {
  id: string;
  name: string;
}

const TeamDataGrid = ({ hackathonId }: TeamDataGridProps) => {
  const {
    data: teams,
    isLoading,
    isError,
  } = useGetHackathonTeamsQuery(hackathonId);

  const columns = [
    { field: 'id', headerName: 'ID' },
    {
      field: 'name',
      headerName: 'Name',
      width: 200,
      type: 'string',
    },
    {
      ...actionColumn,
      renderCell: (params: GridRenderCellParams<TeamRowType>) => (
        <TeamMenu hackathonId={hackathonId} selectedTeamId={params.row.id} />
      ),
    },
  ];

  const tableRows = teams?.map((row: Team) => {
    return {
      id: row.id,
      name: row.name,
    };
  });

  return (
    <ListDataGrid<TeamRowType>
      dataType='teams'
      columns={columns}
      rows={tableRows}
      isError={isError}
      isLoading={isLoading}
    />
  );
};

export default TeamDataGrid;
