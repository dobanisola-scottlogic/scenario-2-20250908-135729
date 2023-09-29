import { Box, TableCell } from '@mui/material';
import { ReactNode } from 'react';

interface MenuTableCellProps {
  text: string;
  menu: ReactNode;
}

const MenuTableCell = ({ text, menu }: MenuTableCellProps) => (
  <TableCell>
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        overflowWrap: 'anywhere',
      }}
    >
      {text}
      {menu}
    </Box>
  </TableCell>
);

export default MenuTableCell;
