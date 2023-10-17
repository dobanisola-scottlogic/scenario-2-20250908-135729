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

import { useGetHackathonTeamsQuery } from '../../api/api';
import { colours } from '../../theme';
import MenuTableCell from '../common/MenuTableCell';
import TeamMenu from '../menus/TeamMenu';

interface TeamListTableProps {
  hackathonId: string;
}

const TeamListTable = ({ hackathonId }: TeamListTableProps) => {
  const {
    data: teams,
    isLoading,
    isError,
  } = useGetHackathonTeamsQuery(hackathonId);

  return (
    <>
      <Box
        sx={{
          background: 'white',
          margin: '10px 0',
          p: '10px 10px 30px 10px',
          borderRadius: '9px',
        }}
      >
        <TableContainer sx={{ maxHeight: '60vh' }}>
          <Table
            stickyHeader
            size='small'
            aria-label='List of hackathon teams'
            style={{ tableLayout: 'fixed' }}
          >
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {isLoading || isError || teams?.length === 0 ? (
                <TableRow
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell align='center'>
                    <Box
                      sx={{
                        minHeight: '3rem',
                        mt: 5,
                      }}
                    >
                      {isLoading && <CircularProgress />}
                      {isError && (
                        <p style={{ color: colours.errorRed }}>
                          Failed to fetch teams. Please try again later.
                        </p>
                      )}
                      {teams?.length === 0 && <p>No teams to display</p>}
                    </Box>
                  </TableCell>
                </TableRow>
              ) : (
                teams?.map((row) => (
                  <TableRow
                    key={row.id}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <MenuTableCell
                      text={row.name}
                      menu={
                        <TeamMenu
                          hackathonId={hackathonId}
                          selectedTeamId={row.id}
                        />
                      }
                    />
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

export default TeamListTable;
