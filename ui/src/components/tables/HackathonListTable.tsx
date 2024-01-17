import { useGetHackathonsQuery } from '~/api/api';
import HackathonMenu from '~/components/menus/HackathonMenu';
import { Hackathon } from '~/interfaces/Hackathon';
import { hackathonRoute } from '~/routing/Routes';
import { ListTable } from '../common/ListTable';

const HackathonListTable = () => {
  const { data: hackathons, isLoading, isError } = useGetHackathonsQuery();

  const tableRows = hackathons?.map((row: Hackathon) => {
    return {
      id: row.id,
      tableCells: [
        {
          text: row.name,
          link: hackathonRoute(row.id),
        },
        {
          text: row.currentMilestoneMap,
        },
        {
          text: row.readableCurrentMilestoneClassName!,
        },
        {
          menuElement: <HackathonMenu selectedHackathonId={row.id} />,
        },
      ],
    };
  });

  return (
    <ListTable
      dataType='hackathons'
      headerRows={['Name', 'Map', 'Bot', 'Action']}
      tableRows={tableRows}
      isError={isError}
      isFixed
      isLoading={isLoading}
    />
  );
};

export default HackathonListTable;
