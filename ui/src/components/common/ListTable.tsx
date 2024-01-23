import {
  Box,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
} from '@mui/material';
import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';

import { listTableStyles } from '~/components/commonStyles';
import { TableSort, TableSortType } from '~/enums/TableSort';
import { colours } from '~/theme';

export interface TableCell {
  link?: string;
  linkTarget?: string;
  menuElement?: JSX.Element;
  text?: string;
}

export interface TableRows {
  id: string;
  tableCells: TableCell[];
}

interface ListTableProps {
  dataType: string;
  headerRows: string[];
  tableRows: TableRows[] | undefined;
  isError: boolean;
  isFixed?: boolean;
  isLoading: boolean;
}

export const ListTable = ({
  dataType,
  headerRows,
  tableRows,
  isError,
  isFixed,
  isLoading,
}: ListTableProps) => {
  const isNoData = tableRows?.length === 0;

  const [tableSortOrder, setTableSortOrder] = useState<TableSortType>(
    TableSort.ASC
  );
  const [tableSortIndex, setTableSortIndex] = useState<number | null>(null);

  const requestSort = (currentSortOrder: TableSortType, fieldIndex: number) => {
    const newOrder =
      currentSortOrder === TableSort.ASC ? TableSort.DESC : TableSort.ASC;

    setTableSortOrder(newOrder);
    setTableSortIndex(fieldIndex);
  };

  const sortedTableRows = useMemo(() => {
    if (tableSortIndex !== null) {
      if (tableSortOrder === TableSort.ASC) {
        return tableRows?.sort((a, b) =>
          (a.tableCells[tableSortIndex].text ?? '').localeCompare(
            b.tableCells[tableSortIndex].text ?? ''
          )
        );
      } else {
        return tableRows?.sort((a, b) =>
          (b.tableCells[tableSortIndex].text ?? '').localeCompare(
            a.tableCells[tableSortIndex].text ?? ''
          )
        );
      }
    }

    return tableRows;
  }, [tableRows, tableSortIndex, tableSortOrder]);

  const getListTableHeaders = () => {
    return headerRows.map((row, index) => (
      <TableCell key={row}>
        {row !== 'Action' && (
          <TableSortLabel
            active={index === tableSortIndex}
            direction={tableSortOrder}
            hideSortIcon
            onClick={() => requestSort(tableSortOrder, index)}
          >
            {row}
          </TableSortLabel>
        )}
      </TableCell>
    ));
  };

  const getListTableRows = () => {
    const tableContent = (
      <>
        {sortedTableRows?.map((tableRow) => {
          return (
            <TableRow key={tableRow.id} sx={listTableStyles.rowStyles}>
              {tableRow.tableCells.map((tableCell, index) => {
                const cellAlign = tableCell.menuElement ? 'right' : 'left';
                const cellContent = (
                  <>
                    {tableCell.link ? (
                      <Link target={tableCell.linkTarget} to={tableCell.link}>
                        {tableCell.text}
                      </Link>
                    ) : (
                      tableCell.menuElement ?? tableCell.text
                    )}
                  </>
                );

                return (
                  <TableCell key={index} align={cellAlign}>
                    {cellContent}
                  </TableCell>
                );
              })}
            </TableRow>
          );
        })}
      </>
    );
    return tableContent;
  };

  return (
    <Box
      sx={{
        background: 'white',
        // 10px border radius, margin and padding
        borderRadius: 2.5,
        my: 1.25,
        px: 1.25,
        py: 1.25,
      }}
    >
      <TableContainer sx={{ height: '60vh', overflowY: 'auto' }}>
        <Table
          aria-label={`List of ${dataType}`}
          size='small'
          stickyHeader
          style={{ tableLayout: isFixed ? 'fixed' : 'initial' }}
        >
          <TableHead>
            <TableRow>{getListTableHeaders()}</TableRow>
          </TableHead>
          <TableBody>
            {isLoading || isError || isNoData ? (
              <TableRow sx={listTableStyles.rowStyles}>
                <TableCell align='center' colSpan={headerRows.length}>
                  <Box
                    sx={{
                      minHeight: '3rem',
                      mt: 5,
                    }}
                  >
                    {isLoading && <CircularProgress />}
                    {isError && (
                      <p style={{ color: colours.errorRed }}>
                        Failed to fetch {dataType}. Please try again later.
                      </p>
                    )}
                    {isNoData && !isLoading && <p>No {dataType} to display.</p>}
                  </Box>
                </TableCell>
              </TableRow>
            ) : (
              getListTableRows()
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};
