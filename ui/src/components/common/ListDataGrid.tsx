import { Box, CircularProgress, Typography } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { colours } from '~/theme';

interface ListDataGridProps<RowType> {
  columns: GridColDef[];
  rows: RowType[] | undefined;
  customHeight?: number;
  dataType: string;
  isError: boolean;
  isLoading: boolean;
}

export default function ListDataGrid<RowType>({
  columns,
  rows,
  customHeight,
  dataType,
  isError,
  isLoading,
}: ListDataGridProps<RowType>) {
  const isNoData = !rows || rows?.length === 0;

  return (
    <Box
      aria-label={`List of ${dataType}`}
      sx={{
        backgroundColor: 'white',
        height: customHeight ?? 450,
        m: 1,
        mx: 'auto',
        p: 1,
        width: '100%',
      }}
    >
      {isLoading || isError || isNoData ? (
        <>
          {isLoading && <CircularProgress />}
          {isError && (
            <p style={{ color: colours.errorRed }}>
              Failed to fetch {dataType}. Please try again later.
            </p>
          )}
          {isNoData && !isLoading && (
            <Typography variant='subtitle1' gutterBottom>
              No {dataType} to display.
            </Typography>
          )}
        </>
      ) : (
        <DataGrid
          initialState={{
            columns: {
              columnVisibilityModel: {
                id: false, // Data grid always requires unique id column, default to hide from user
              },
            },
          }}
          columns={columns}
          rows={rows ?? []}
          pageSizeOptions={[5]}
          disableVirtualization
        />
      )}
    </Box>
  );
}
