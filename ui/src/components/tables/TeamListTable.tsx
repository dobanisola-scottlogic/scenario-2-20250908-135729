import { useGetHackathonTeamsQuery } from '~/api/api';
import TeamMenu from '~/components/menus/TeamMenu';
import { Team } from '~/interfaces/Team';
import { ListTable } from '../common/ListTable';

interface TeamListTableProps {
  hackathonId: string;
}

const TeamListTable = ({ hackathonId }: TeamListTableProps) => {
  const {
    data: teams,
    isLoading,
    isError,
  } = useGetHackathonTeamsQuery(hackathonId);

  const tableRows = teams?.map((row: Team) => {
    return {
      id: row.id,
      tableCells: [
        {
          text: row.name,
        },
        {
          menuElement: (
            <TeamMenu hackathonId={hackathonId} selectedTeamId={row.id} />
          ),
        },
      ],
    };
  });

  return (
    <ListTable
      dataType='teams'
      headerRows={['Name', 'Action']}
      tableRows={tableRows}
      isError={isError}
      isLoading={isLoading}
    />
  );
};

export default TeamListTable;
