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
import { useGetHackathonsQuery } from '../../api/api';
import { colours } from '../../theme';
import MenuTableCell from '../common/MenuTableCell';
import HackathonMenu from '../menus/HackathonMenu';

const HackathonListTable = () => {
  const { data: hackathons, isLoading, isError } = useGetHackathonsQuery();

  return (
    <>
      <Box
        sx={{
          background: 'white',
          p: '10px 10px 30px 10px',
          borderRadius: '9px',
        }}
      >
        <TableContainer sx={{ maxHeight: '60vh' }}>
          <Table
            stickyHeader
            size='small'
            aria-label='hackathon table'
            style={{ tableLayout: 'fixed' }}
          >
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Map</TableCell>
                <TableCell>Bot</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {isLoading || isError || hackathons?.length === 0 ? (
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
                          Failed to fetch hackathons. Please try again later.
                        </p>
                      )}
                      {hackathons?.length === 0 && (
                        <p>No hackathons to display.</p>
                      )}
                    </Box>
                  </TableCell>
                </TableRow>
              ) : (
                hackathons?.map((row) => (
                  <TableRow
                    key={row.id}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <TableCell component='th' scope='row'>
                      <Link to={`${import.meta.env.BASE_URL}${row.id}`}>
                        {row.name}
                      </Link>
                    </TableCell>
                    <TableCell>{row.currentMilestoneMap}</TableCell>
                    <MenuTableCell
                      text={row.readableCurrentMilestoneClassName!}
                      menu={<HackathonMenu selectedHackathonId={row.id} />}
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

export default HackathonListTable;
