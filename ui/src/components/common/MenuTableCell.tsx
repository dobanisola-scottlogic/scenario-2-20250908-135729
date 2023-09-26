import { TableCell } from '@mui/material';
import { ReactNode } from 'react';

interface MenuTableCellProps {
  text: string;
  menu: ReactNode;
}

const MenuTableCell = ({ text, menu }: MenuTableCellProps) => (
  <TableCell
    sx={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    }}
  >
    {text}
    {menu}
  </TableCell>
);

export default MenuTableCell;
