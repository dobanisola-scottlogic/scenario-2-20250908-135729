import { GridColDef } from '@mui/x-data-grid';
import { DataGridAlignment } from '~/enums/DataGrid';

export const actionColumn: GridColDef = {
  field: 'action',
  headerName: 'Action',
  width: 100,
  renderCell: undefined, // When action column is used this should be replaced with a menu element
  type: 'string',
  sortable: false,
  headerAlign: DataGridAlignment.RIGHT,
  align: DataGridAlignment.RIGHT,
};
