import { fireEvent, screen } from '@testing-library/react';
import { Route, Routes } from 'react-router-dom';

import { getHackathonsNetworkErrorResponseHandler } from '~/mocks/handlers/hackathon';
import { server } from '~/mocks/server';
import { testHackathonBody } from '~/mocks/test-data/hackathon';
import {
  baseRouteForTesting,
  hackathonRouteForTesting,
} from '~/routing/Routes';
import { removeMilestoneBotPrefix } from '~/utils/milestone-utils';
import { renderWithRouterAndProvider } from '~/utils/test-utils';
import HackathonListTable from './HackathonListTable';

describe('HackathonListTable', () => {
  const hackathonName = testHackathonBody.name;
  const hackathonMilestoneBot = removeMilestoneBotPrefix(
    testHackathonBody.currentMilestoneClassName
  );
  const hackathonMap = testHackathonBody.currentMilestoneMap;

  it('should render the table correctly after successful data fetch', async () => {
    renderWithRouterAndProvider(
      <Routes>
        <Route path={baseRouteForTesting} element={<HackathonListTable />} />
        <Route
          path={hackathonRouteForTesting}
          element={<div data-testid='hackathon-details-page' />}
        />
      </Routes>
    );

    expect(
      screen.getByRole('columnheader', { name: 'Name' })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('columnheader', { name: 'Map' })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('columnheader', { name: 'Bot' })
    ).toBeInTheDocument();

    const rowHeader = await screen.findByRole('cell', {
      name: hackathonName,
    });
    const mapCell = await screen.findByRole('cell', {
      name: hackathonMap,
    });
    const botCell = await screen.findByRole('cell', {
      name: hackathonMilestoneBot,
    });
    const moreMenu = await screen.findByRole('button', {
      name: 'more',
    });

    expect(rowHeader).toBeInTheDocument();
    expect(mapCell).toBeInTheDocument();
    expect(botCell).toBeInTheDocument();
    expect(moreMenu).toBeInTheDocument();
  });

  it('should display an error message after unsuccessful data fetch', async () => {
    server.use(getHackathonsNetworkErrorResponseHandler);

    renderWithRouterAndProvider(
      <Routes>
        <Route path={baseRouteForTesting} element={<HackathonListTable />} />
        <Route
          path={hackathonRouteForTesting}
          element={<div data-testid='hackathon-details-page' />}
        />
      </Routes>
    );

    const error = await screen.findByText(
      'Failed to fetch hackathons. Please try again later.'
    );
    expect(error).toBeInTheDocument();
  });

  it('should navigate to the hackathon details page', async () => {
    renderWithRouterAndProvider(
      <Routes>
        <Route path={baseRouteForTesting} element={<HackathonListTable />} />
        <Route
          path={hackathonRouteForTesting}
          element={<div data-testid='hackathon-details-page' />}
        />
      </Routes>
    );

    const link = await screen.findByRole('link', { name: hackathonName });
    fireEvent.click(link);

    expect(screen.getByTestId('hackathon-details-page')).toBeInTheDocument();
  });
});
