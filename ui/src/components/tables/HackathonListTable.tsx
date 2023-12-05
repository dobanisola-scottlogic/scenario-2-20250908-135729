import { TableCell, TableRow } from '@mui/material';
import { Link } from 'react-router-dom';

import { useGetHackathonsQuery } from '~/api/api';
import MenuTableCell from '~/components/common/MenuTableCell';
import HackathonMenu from '~/components/menus/HackathonMenu';
import { Hackathon } from '~/interfaces/Hackathon';
import { hackathonRoute } from '~/routing/Routes';
import ListTable from '../common/ListTable';
import { listTableStyles } from '../commonStyles';

const HackathonListTable = () => {
  const { data: hackathons, isLoading, isError } = useGetHackathonsQuery();

  const tableRows = hackathons?.map((row: Hackathon) => (
    <TableRow key={row.id} sx={listTableStyles.rowStyles}>
      <TableCell component='th' scope='row'>
        <Link to={hackathonRoute(row.id)}>{row.name}</Link>
      </TableCell>
      <TableCell>{row.currentMilestoneMap}</TableCell>
      <MenuTableCell
        text={row.readableCurrentMilestoneClassName!}
        menu={<HackathonMenu selectedHackathonId={row.id} />}
      />
    </TableRow>
  ));

  return (
    <ListTable
      dataType='hackathons'
      headerRows={['Name', 'Map', 'Bot']}
      tableRows={tableRows}
      isError={isError}
      isFixed
      isLoading={isLoading}
      isNoData={hackathons?.length === 0}
    />
  );
};

export default HackathonListTable;
