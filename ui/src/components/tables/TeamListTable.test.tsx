import { screen } from '@testing-library/react';

import { getTeamsNetworkErrorResponseHandler } from '../../mocks/handlers/team';
import { server } from '../../mocks/server';
import { renderWithRouterAndProvider } from '../../utils/test-utils';
import TeamListTable from './TeamListTable';

describe('TeamListTable', () => {
  it('should render the table correctly after successful data fetch', async () => {
    renderWithRouterAndProvider(<TeamListTable hackathonId='test-id' />);

    expect(
      screen.getByRole('columnheader', { name: 'Name' })
    ).toBeInTheDocument();

    const rowHeader = await screen.findByRole('cell', {
      name: 'Team 1',
    });
    const moreMenu = await screen.findByRole('button', {
      name: 'more',
    });

    expect(rowHeader).toBeInTheDocument();
    expect(moreMenu).toBeInTheDocument();
  });

  it('should display an error message after unsuccessful data fetch', async () => {
    renderWithRouterAndProvider(<TeamListTable hackathonId='test-id' />);

    server.use(getTeamsNetworkErrorResponseHandler);

    const error = await screen.findByText(
      'Failed to fetch teams. Please try again later.'
    );

    expect(error).toBeInTheDocument();
  });
});
