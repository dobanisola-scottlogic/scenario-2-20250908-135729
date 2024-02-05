import { GridRenderCellParams } from '@mui/x-data-grid';
import { fireEvent, screen } from '@testing-library/react';
import { Link } from 'react-router-dom';

import HackathonMenu from '~/components/menus/HackathonMenu';
import { actionColumn } from '~/utils/common-columns';
import { renderWithRouterAndProvider } from '~/utils/test-utils';
import ListDataGrid from './ListDataGrid';

interface TestRowType {
  id: string;
  name: string;
  link: string;
  map: string;
}

const testGridColumns = [
  { field: 'id', headerName: 'ID', type: 'string' },
  {
    field: 'name',
    headerName: 'Name',
    width: 100,
    renderCell: (params: GridRenderCellParams<TestRowType>) => (
      <Link to={params.row.link}>{params.row.name}</Link>
    ),
    type: 'string',
  },
  {
    field: 'map',
    headerName: 'Map',
    type: 'string',
  },
  {
    ...actionColumn,
    renderCell: (params: GridRenderCellParams<TestRowType>) => (
      <HackathonMenu selectedHackathonId={params.row.id} />
    ),
  },
];

const testGridRows = [
  {
    id: '1',
    name: 'Banana',
    link: 'https://blog.scottlogic.com/',
    map: 'Easy',
  },
  {
    id: '2',
    name: 'Apple',
    link: 'https://blog.scottlogic.com/',
    map: 'Medium',
  },
  {
    id: '3',
    name: '',
    link: 'https://blog.scottlogic.com/',
    map: 'Three Star',
  },
];

describe('ListDataGrid', () => {
  describe('Has data available', () => {
    beforeEach(() => {
      renderWithRouterAndProvider(
        <ListDataGrid
          dataType='games'
          columns={testGridColumns}
          rows={testGridRows}
          isError={false}
          isLoading={false}
        />
      );
    });

    it('should render the ListDataGrid component correctly', async () => {
      expect(screen.getByLabelText('List of games')).toBeInTheDocument();

      // Renders header
      expect(
        screen.getByRole('columnheader', { name: 'Name' })
      ).toBeInTheDocument();
      expect(
        screen.getByRole('columnheader', { name: 'Map' })
      ).toBeInTheDocument();
      expect(
        screen.getByRole('columnheader', { name: 'Action' })
      ).toBeInTheDocument();

      // ID header is not rendered by default
      expect(
        screen.queryByRole('columnheader', { name: 'ID' })
      ).not.toBeInTheDocument();

      // Renders rows
      expect(screen.getAllByRole('cell')[0]).toHaveTextContent('Banana');
      expect(screen.getAllByRole('cell')[1]).toHaveTextContent('Easy');

      expect(screen.getAllByRole('cell')[3]).toHaveTextContent('Apple');
      expect(screen.getAllByRole('cell')[4]).toHaveTextContent('Medium');

      expect(screen.getAllByRole('cell')[6]).toHaveTextContent('');
      expect(screen.getAllByRole('cell')[7]).toHaveTextContent('Three Star');

      // Menu elements are right-aligned
      expect(screen.getAllByRole('cell')[2]).toHaveClass(
        'MuiDataGrid-cell--textRight'
      );

      // Renders action menu buttons on each row
      const moreMenu = await screen.findAllByRole('button', { name: 'more' });
      expect(moreMenu).toHaveLength(3);
    });

    it('should sort rows by ASC and DESC correctly including with empty strings', () => {
      expect(screen.getByLabelText('List of games')).toBeInTheDocument();

      // Unsorted
      expect(screen.getAllByRole('cell')[0]).toHaveTextContent('Banana');
      expect(screen.getAllByRole('cell')[3]).toHaveTextContent('Apple');

      // Sort on first column - ASC order
      fireEvent.click(screen.getByRole('columnheader', { name: 'Name' }));
      expect(screen.getAllByRole('cell')[0]).toHaveTextContent('');
      expect(screen.getAllByRole('cell')[3]).toHaveTextContent('Apple');
      expect(screen.getAllByRole('cell')[6]).toHaveTextContent('Banana');

      // Sort on first column - DESC order
      fireEvent.click(screen.getByRole('columnheader', { name: 'Name' }));
      expect(screen.getAllByRole('cell')[0]).toHaveTextContent('Banana');
      expect(screen.getAllByRole('cell')[3]).toHaveTextContent('Apple');
      expect(screen.getAllByRole('cell')[6]).toHaveTextContent('');
    });
  });

  describe('Has no data available', () => {
    it('should render the ListDataGrid component with no data label', () => {
      renderWithRouterAndProvider(
        <ListDataGrid
          dataType='games'
          columns={testGridColumns}
          rows={[]}
          isError={false}
          isLoading={false}
        />
      );

      expect(screen.getByText('No games to display.')).toBeInTheDocument();
    });

    it('should render the ListDataGrid component with error label', () => {
      renderWithRouterAndProvider(
        <ListDataGrid
          dataType='games'
          columns={testGridColumns}
          rows={[]}
          isError={true}
          isLoading={false}
        />
      );

      expect(
        screen.getByText('Failed to fetch games. Please try again later.')
      ).toBeInTheDocument();
    });

    it('should render CircularProgress when is loading', () => {
      renderWithRouterAndProvider(
        <ListDataGrid
          dataType='games'
          columns={testGridColumns}
          rows={[]}
          isError={false}
          isLoading={true}
        />
      );

      expect(screen.getByRole('progressbar')).toBeInTheDocument();
    });
  });
});
