import {
  Box,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import { Link } from 'react-router-dom';

import { useGetHackathonGamesQuery } from '../../api/api';
import { colours } from '../../theme';
import { getGameTimeString } from '../../utils/game-utils';

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

  return (
    <>
      <Box
        sx={{
          background: 'white',
          borderRadius: '9px',
          margin: '10px 0',
          p: '10px 10px 30px 10px',
        }}
      >
        <TableContainer sx={{ height: '60vh', overflowY: 'auto' }}>
          <Table stickyHeader size='small' aria-label='List of hackathon games'>
            <TableHead>
              <TableRow>
                <TableCell>Teams</TableCell>
                <TableCell>Map</TableCell>
                <TableCell>Start Time</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {isLoading || isError || games?.length === 0 ? (
                <TableRow
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell align='center' colSpan={3}>
                    <Box
                      sx={{
                        minHeight: '3rem',
                        mt: 5,
                      }}
                    >
                      {isLoading && <CircularProgress />}
                      {isError && (
                        <p style={{ color: colours.errorRed }}>
                          Failed to fetch games. Please try again later.
                        </p>
                      )}
                      {games?.length === 0 && (
                        <p>There is no game to display.</p>
                      )}
                    </Box>
                  </TableCell>
                </TableRow>
              ) : (
                games?.map((row) => (
                  <TableRow
                    key={row.id}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <TableCell>
                      <Link
                        to={`${gameViewerBaseUrl}/?hackathonId=${row.game.hackathonId}&gameId=${row.id}`}
                        target={row.id}
                      >
                        {row.game.title}
                      </Link>
                    </TableCell>
                    <TableCell>{row?.game?.map?.name}</TableCell>
                    <TableCell>
                      {getGameTimeString(row?.game?.gameTime)}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </>
  );
};

export default GameResultListTable;
