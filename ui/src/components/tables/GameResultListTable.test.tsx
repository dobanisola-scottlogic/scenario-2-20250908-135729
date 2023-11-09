import { screen } from '@testing-library/react';

import { getGameResultsNetworkErrorResponseHandler } from '../../mocks/handlers/game';
import { server } from '../../mocks/server';
import { renderWithRouterAndProvider } from '../../utils/test-utils';
import GameResultListTable from './GameResultListTable';

describe('GameResultListTable', () => {
  it('should render the table correctly after successful data fetch', async () => {
    renderWithRouterAndProvider(
      <GameResultListTable hackathonId='hackathon1' />
    );

    expect(
      screen.getByRole('columnheader', { name: 'Teams' })
    ).toBeInTheDocument();

    expect(
      screen.getByRole('columnheader', { name: 'Map' })
    ).toBeInTheDocument();

    expect(
      screen.getByRole('columnheader', { name: 'Start Time' })
    ).toBeInTheDocument();

    const teamCellRow1 = await screen.findByRole('cell', {
      name: 'Milestone1Bot vs Milestone2Bot',
    });

    const mapCellRow1 = await screen.findByRole('cell', {
      name: 'Easy',
    });

    const startTimeCellRow1 = await screen.findByRole('cell', {
      name: 'Fri, 09:12:34',
    });

    expect(teamCellRow1).toBeInTheDocument();
    expect(mapCellRow1).toBeInTheDocument();
    expect(startTimeCellRow1).toBeInTheDocument();
  });

  it('should display an error message after unsuccessful data fetch', async () => {
    renderWithRouterAndProvider(
      <GameResultListTable hackathonId='hackathon1' />
    );

    server.use(getGameResultsNetworkErrorResponseHandler);

    const error = await screen.findByText(
      'Failed to fetch games. Please try again later.'
    );

    expect(error).toBeInTheDocument();
  });
});
