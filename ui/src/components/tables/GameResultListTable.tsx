import { useGetHackathonGamesQuery } from '~/api/api';
import { GameResult } from '~/interfaces/GameResult';
import { getGameTimeString } from '~/utils/game-utils';
import { ListTable } from '../common/ListTable';

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

  const tableRows = games?.map((row: GameResult) => {
    const gameViewerLink = `${gameViewerBaseUrl}/?hackathonId=${row.game.hackathonId}&gameId=${row.id}`;

    /* For use during development - remove old link when new player is in usable state */
    // const gameViewerLink = hackathonGameRoute(row.game.hackathonId, row.id);

    return {
      id: row.id,
      tableCells: [
        {
          text: row.game.title ?? '',
          link: gameViewerLink,
          linkTarget: '_blank',
        },
        {
          text: row?.game?.map?.name,
        },
        {
          text: getGameTimeString(row?.game?.gameTime),
        },
      ],
    };
  });

  return (
    <ListTable
      dataType='games'
      headerRows={['Teams', 'Map', 'Start Time']}
      tableRows={tableRows}
      isError={isError}
      isLoading={isLoading}
    />
  );
};

export default GameResultListTable;
