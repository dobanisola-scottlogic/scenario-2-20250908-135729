import { fireEvent, screen } from '@testing-library/react';
import HackathonMenu from '~/components/menus/HackathonMenu';
import { renderWithRouterAndProvider } from '~/utils/test-utils';
import { ListTable } from './ListTable';

describe('ListTable', () => {
  describe('Has data available', () => {
    beforeEach(() => {
      const testTableRows = [
        {
          id: 'testRowId-1',
          tableCells: [
            {
              text: 'Banana',
            },
            {
              text: '',
            },
            {
              text: 'Egg',
              link: 'https://blog.scottlogic.com/',
              linkTarget: '_blank',
            },
            {
              menuElement: (
                <HackathonMenu selectedHackathonId='testHackathonId-1' />
              ),
            },
          ],
        },
        {
          id: 'testRowId-2',
          tableCells: [
            {
              text: 'Apple',
            },
            {
              text: 'Dill',
            },
            {
              text: 'Frappucino',
              link: 'https://www.scottlogic.com/what-we-do',
              linkTarget: '_blank',
            },
            {
              menuElement: (
                <HackathonMenu selectedHackathonId='testHackathonId-2' />
              ),
            },
          ],
        },
      ];

      renderWithRouterAndProvider(
        <ListTable
          dataType='games'
          headerRows={['Header 1', 'Header 2', 'Header 3', 'Action']}
          tableRows={testTableRows}
          isError={false}
          isFixed
          isLoading={false}
        />
      );
    });

    it('should render the ListTable component correctly', async () => {
      // Renders header
      expect(
        screen.getByRole('columnheader', { name: 'Header 1' })
      ).toBeInTheDocument();
      expect(
        screen.getByRole('columnheader', { name: 'Header 2' })
      ).toBeInTheDocument();
      expect(
        screen.getByRole('columnheader', { name: 'Header 3' })
      ).toBeInTheDocument();

      // Menu header is not rendered
      expect(
        screen.queryByRole('columnheader', { name: 'Action' })
      ).not.toBeInTheDocument();

      // Renders rows
      expect(screen.getAllByRole('cell')[0]).toHaveTextContent('Banana');
      expect(screen.getAllByRole('cell')[1]).toHaveTextContent('');
      expect(screen.getAllByRole('cell')[2]).toHaveTextContent('Egg');

      expect(screen.getAllByRole('cell')[4]).toHaveTextContent('Apple');
      expect(screen.getAllByRole('cell')[5]).toHaveTextContent('Dill');
      expect(screen.getAllByRole('cell')[6]).toHaveTextContent('Frappucino');

      // Menu elements are right-aligned, others are not
      expect(screen.getAllByRole('cell')[0]).toHaveClass(
        'MuiTableCell-alignLeft'
      );
      expect(screen.getAllByRole('cell')[3]).toHaveClass(
        'MuiTableCell-alignRight'
      );
      expect(screen.getAllByRole('cell')[7]).toHaveClass(
        'MuiTableCell-alignRight'
      );

      // Renders action menu buttons on each row
      const moreMenu = await screen.findAllByRole('button', { name: 'more' });
      expect(moreMenu).toHaveLength(2);
    });

    it('should sort rows by ASC and DESC correctly including with empty strings', () => {
      // Unsorted
      expect(screen.getAllByRole('cell')[0]).toHaveTextContent('Banana');
      expect(screen.getAllByRole('cell')[4]).toHaveTextContent('Apple');

      // Sort on first column - ASC order
      fireEvent.click(screen.getByRole('columnheader', { name: 'Header 1' }));
      expect(screen.getAllByRole('cell')[0]).toHaveTextContent('Apple');
      expect(screen.getAllByRole('cell')[4]).toHaveTextContent('Banana');

      // Sort on second column with empty string - DESC order
      fireEvent.click(screen.getByRole('columnheader', { name: 'Header 2' }));
      expect(screen.getAllByRole('cell')[1]).toHaveTextContent('Dill');
      expect(screen.getAllByRole('cell')[5]).toHaveTextContent('');

      // Sort on second column with empty string - ASC order
      fireEvent.click(screen.getByRole('columnheader', { name: 'Header 2' }));
      expect(screen.getAllByRole('cell')[1]).toHaveTextContent('');
      expect(screen.getAllByRole('cell')[5]).toHaveTextContent('Dill');

      // Sort on third link column - DESC order
      fireEvent.click(screen.getByRole('columnheader', { name: 'Header 3' }));
      expect(screen.getAllByRole('cell')[2]).toHaveTextContent('Frappucino');
      expect(screen.getAllByRole('cell')[6]).toHaveTextContent('Egg');
    });
  });

  describe('Has no data available', () => {
    it('should render the ListTable component with no data label', () => {
      renderWithRouterAndProvider(
        <ListTable
          dataType='games'
          headerRows={['Header 1', 'Header 2', 'Header 3', 'Action']}
          tableRows={[]}
          isError={false}
          isLoading={false}
        />
      );

      expect(screen.getByText('No games to display.')).toBeInTheDocument();
    });

    it('should render the ListTable component with error label', () => {
      renderWithRouterAndProvider(
        <ListTable
          dataType='games'
          headerRows={['Header 1', 'Header 2', 'Header 3', 'Action']}
          tableRows={[]}
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
        <ListTable
          dataType='games'
          headerRows={['Header 1', 'Header 2', 'Header 3', 'Action']}
          tableRows={[]}
          isError={false}
          isLoading={true}
        />
      );

      expect(screen.getByRole('progressbar')).toBeInTheDocument();
    });
  });
});
