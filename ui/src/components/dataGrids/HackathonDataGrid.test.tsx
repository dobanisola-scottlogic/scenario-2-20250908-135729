import { fireEvent, screen } from '@testing-library/react';
import { Route, Routes } from 'react-router-dom';

import {
  getHackathonsNetworkErrorResponseHandler,
  getHackathonsNoContentResponseHandler,
} from '~/mocks/handlers/hackathon';
import { server } from '~/mocks/server';
import { testHackathonBody } from '~/mocks/test-data/hackathon';
import {
  baseRouteForTesting,
  hackathonRouteForTesting,
} from '~/routing/Routes';
import { removeMilestoneBotPrefix } from '~/utils/milestone-utils';
import { renderWithRouterAndProvider } from '~/utils/test-utils';
import HackathonDataGrid from './HackathonDataGrid';

describe('HackathonDataGrid', () => {
  const hackathonName = testHackathonBody.name;
  const hackathonMilestoneBot = removeMilestoneBotPrefix(
    testHackathonBody.currentMilestoneClassName
  );
  const hackathonMap = testHackathonBody.currentMilestoneMap;

  it('should render the data grid correctly after successful data fetch', async () => {
    renderWithRouterAndProvider(
      <Routes>
        <Route path={baseRouteForTesting} element={<HackathonDataGrid />} />
        <Route
          path={hackathonRouteForTesting}
          element={<div data-testid='hackathon-details-page' />}
        />
      </Routes>
    );

    expect(screen.getByLabelText('List of hackathons')).toBeInTheDocument();

    const nameColumnHeader = await screen.findByRole('columnheader', {
      name: 'Name',
    });
    const mapColumnHeader = await screen.findByRole('columnheader', {
      name: 'Map',
    });
    const botColumnHeader = await screen.findByRole('columnheader', {
      name: 'Bot',
    });
    const actionColumnHeader = await screen.findByRole('columnheader', {
      name: 'Action',
    });

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

    expect(nameColumnHeader).toBeInTheDocument();
    expect(mapColumnHeader).toBeInTheDocument();
    expect(botColumnHeader).toBeInTheDocument();
    expect(actionColumnHeader).toBeInTheDocument();

    expect(rowHeader).toBeInTheDocument();
    expect(mapCell).toBeInTheDocument();
    expect(botCell).toBeInTheDocument();
    expect(moreMenu).toBeInTheDocument();
  });

  it('should display a message if data is fetched successfully but there are no hackathons', async () => {
    server.use(getHackathonsNoContentResponseHandler);

    renderWithRouterAndProvider(
      <Routes>
        <Route path={baseRouteForTesting} element={<HackathonDataGrid />} />
        <Route
          path={hackathonRouteForTesting}
          element={<div data-testid='hackathon-details-page' />}
        />
      </Routes>
    );

    const noHackathons = await screen.findByText('No hackathons to display.');
    expect(noHackathons).toBeInTheDocument();
  });

  it('should display an error message after unsuccessful data fetch', async () => {
    server.use(getHackathonsNetworkErrorResponseHandler);

    renderWithRouterAndProvider(
      <Routes>
        <Route path={baseRouteForTesting} element={<HackathonDataGrid />} />
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
        <Route path={baseRouteForTesting} element={<HackathonDataGrid />} />
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
