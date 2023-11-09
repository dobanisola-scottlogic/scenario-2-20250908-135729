import { screen } from '@testing-library/react';

import { getTeamsNetworkErrorResponseHandler } from '../../mocks/handlers/team';
import { server } from '../../mocks/server';
import { testHackathonId } from '../../mocks/test-data/hackathon';
import { testTeamBody } from '../../mocks/test-data/team';
import { renderWithRouterAndProvider } from '../../utils/test-utils';
import TeamListTable from './TeamListTable';

describe('TeamListTable', () => {
  const hackathonId = testHackathonId.valid;

  it('should render the table correctly after successful data fetch', async () => {
    renderWithRouterAndProvider(<TeamListTable hackathonId={hackathonId} />);

    expect(
      screen.getByRole('columnheader', { name: 'Name' })
    ).toBeInTheDocument();

    const rowHeader = await screen.findByRole('cell', {
      name: testTeamBody.name,
    });
    const moreMenu = await screen.findByRole('button', {
      name: 'more',
    });

    expect(rowHeader).toBeInTheDocument();
    expect(moreMenu).toBeInTheDocument();
  });

  it('should display an error message after unsuccessful data fetch', async () => {
    server.use(getTeamsNetworkErrorResponseHandler);

    renderWithRouterAndProvider(<TeamListTable hackathonId={hackathonId} />);

    const error = await screen.findByText(
      'Failed to fetch teams. Please try again later.'
    );

    expect(error).toBeInTheDocument();
  });
});
