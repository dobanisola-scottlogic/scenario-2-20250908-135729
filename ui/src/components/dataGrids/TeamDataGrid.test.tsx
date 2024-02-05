import { screen } from '@testing-library/react';

import { getTeamsNetworkErrorResponseHandler } from '~/mocks/handlers/team';
import { server } from '~/mocks/server';
import { testHackathonId } from '~/mocks/test-data/hackathon';
import { testTeamBody } from '~/mocks/test-data/team';
import { renderWithRouterAndProvider } from '~/utils/test-utils';
import TeamDataGrid from './TeamDataGrid';

describe('TeamDataGrid', () => {
  const hackathonId = testHackathonId.valid;

  it('should render the data grid correctly after successful data fetch', async () => {
    renderWithRouterAndProvider(<TeamDataGrid hackathonId={hackathonId} />);

    expect(screen.getByLabelText('List of teams')).toBeInTheDocument();

    const columnHeader = await screen.findByRole('columnheader', {
      name: 'Name',
    });
    const actionColumnHeader = await screen.findByRole('columnheader', {
      name: 'Action',
    });
    const rowHeader = await screen.findByRole('cell', {
      name: testTeamBody.name,
    });
    const moreMenu = await screen.findByRole('button', {
      name: 'more',
    });

    expect(columnHeader).toBeInTheDocument();
    expect(actionColumnHeader).toBeInTheDocument();
    expect(rowHeader).toBeInTheDocument();
    expect(moreMenu).toBeInTheDocument();
  });

  it('should display an error message after unsuccessful data fetch', async () => {
    server.use(getTeamsNetworkErrorResponseHandler);

    renderWithRouterAndProvider(<TeamDataGrid hackathonId={hackathonId} />);

    const error = await screen.findByText(
      'Failed to fetch teams. Please try again later.'
    );

    expect(error).toBeInTheDocument();
  });
});
