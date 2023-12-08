import { TableCell, TableRow } from '@mui/material';
import { Link } from 'react-router-dom';

import { useGetHackathonGamesQuery } from '~/api/api';
import ListTable from '~/components/common/ListTable';
import { listTableStyles } from '~/components/commonStyles';
import { GameResult } from '~/interfaces/GameResult';
import { getGameTimeString } from '~/utils/game-utils';

const gameViewerBaseUrl = import.meta.env.VITE_GAME_VIEWER_BASE_URL;

interface GameResultListTableProps {
  hackathonId: string;
}

const GameResultListTable = ({ hackathonId }: GameResultListTableProps) => {
  const {
    data: games,
    isLoading,
    isError,
  } = useGetHackathonGamesQuery(hackathonId);

  const tableRows = games?.map((row: GameResult) => (
    <TableRow key={row.id} sx={listTableStyles.rowStyles}>
      <TableCell>
        <Link
          to={`${gameViewerBaseUrl}/?hackathonId=${row.game.hackathonId}&gameId=${row.id}`}
          target={row.id}
        >
          {row.game.title}
        </Link>
        {/* For use during development - remove old link when new player is in usable state */}
        {/* <Link to={hackathonGameRoute(row.game.hackathonId, row.id)}>
          {row.game.title}
        </Link> */}
      </TableCell>
      <TableCell>{row?.game?.map?.name}</TableCell>
      <TableCell>{getGameTimeString(row?.game?.gameTime)}</TableCell>
    </TableRow>
  ));

  return (
    <ListTable
      dataType='games'
      headerRows={['Teams', 'Map', 'Start Time']}
      tableRows={tableRows}
      isError={isError}
      isLoading={isLoading}
      isNoData={games?.length === 0}
    />
  );
};

export default GameResultListTable;
