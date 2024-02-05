import { GridRenderCellParams } from '@mui/x-data-grid';
import { Link } from 'react-router-dom';

import { useGetHackathonsQuery } from '~/api/api';
import ListDataGrid from '~/components/common/ListDataGrid';
import HackathonMenu from '~/components/menus/HackathonMenu';
import { Hackathon } from '~/interfaces/Hackathon';
import { hackathonRoute } from '~/routing/Routes';
import { actionColumn } from '~/utils/common-columns';

interface HackathonRowType {
  id: string;
  name: string;
  link: string;
  map: string;
  bot: string;
}

const HackathonDataGrid = () => {
  const { data: hackathons, isLoading, isError } = useGetHackathonsQuery();

  const columns = [
    { field: 'id', headerName: 'ID' },
    {
      field: 'name',
      headerName: 'Name',
      width: 400,
      renderCell: (params: GridRenderCellParams<HackathonRowType>) => (
        <Link to={params.row.link}>{params.row.name}</Link>
      ),
      type: 'string',
    },
    { field: 'map', headerName: 'Map', width: 400 },
    { field: 'bot', headerName: 'Bot', width: 400 },
    {
      ...actionColumn,
      renderCell: (params: GridRenderCellParams<HackathonRowType>) => (
        <HackathonMenu selectedHackathonId={params.row.id} />
      ),
      width: 200,
    },
  ];

  const tableRows = hackathons?.map((row: Hackathon) => {
    return {
      id: row.id,
      name: row.name,
      link: hackathonRoute(row.id),
      map: row.currentMilestoneMap,
      bot: row.readableCurrentMilestoneClassName!,
    };
  });

  return (
    <ListDataGrid<HackathonRowType>
      dataType='hackathons'
      columns={columns}
      rows={tableRows}
      isError={isError}
      isLoading={isLoading}
    />
  );
};

export default HackathonDataGrid;
