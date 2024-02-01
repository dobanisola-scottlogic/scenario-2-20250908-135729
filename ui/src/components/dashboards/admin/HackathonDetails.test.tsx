import { screen, waitFor } from '@testing-library/react';
import { Route, Routes } from 'react-router-dom';
import {
  testHackathonBody,
  testHackathonId,
} from '~/mocks/test-data/hackathon';
import { hackathonRoute, hackathonRouteForTesting } from '~/routing/Routes';
import { removeMilestoneBotPrefix } from '~/utils/milestone-utils';
import { renderWithRouterAndProvider } from '~/utils/test-utils';
import HackathonDetails from './HackathonDetails';

describe('HackathonDetails', () => {
  const hackathonName = testHackathonBody.name;
  const hackathonMap = testHackathonBody.currentMilestoneMap;
  const hackathonMilestoneBot = removeMilestoneBotPrefix(
    testHackathonBody.currentMilestoneClassName
  );

  it('should render the hackathon details of the hackathon with ID specified in the url path', async () => {
    renderWithRouterAndProvider(
      <Routes>
        <Route
          path={hackathonRouteForTesting}
          element={<HackathonDetails />}
        ></Route>
      </Routes>,
      {
        initialEntries: [hackathonRoute(testHackathonId.valid)],
      }
    );

    expect(
      await screen.findByRole('link', { name: 'Hackathons' })
    ).toBeInTheDocument();
    expect(await screen.findByText(hackathonName)).toBeInTheDocument();
    expect(screen.getByText('Current Milestone:')).toBeInTheDocument();
    expect(
      await screen.findByText(
        `Map: ${hackathonMap} - Bot: ${hackathonMilestoneBot}`,
        { exact: false }
      )
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Add a new team' })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Add a new game' })
    ).toBeInTheDocument();
  });

  it('should render the success snackbar correctly', () => {
    renderWithRouterAndProvider(
      <Routes>
        <Route
          path={hackathonRouteForTesting}
          element={<HackathonDetails />}
        ></Route>
      </Routes>,
      {
        initialEntries: [hackathonRoute(testHackathonId.valid)],
        preloadedState: {
          snackbar: { isOpen: true, message: 'Team created successfully!' },
        },
      }
    );

    expect(screen.getByRole('alert')).toHaveTextContent(
      'Team created successfully!'
    );
  });

  it('should show correct error message for non-existent hackathon', async () => {
    renderWithRouterAndProvider(
      <Routes>
        <Route
          path={hackathonRouteForTesting}
          element={<HackathonDetails />}
        ></Route>
      </Routes>,
      {
        initialEntries: [hackathonRoute(testHackathonId.notFound)],
      }
    );

    await waitFor(() => {
      expect(
        screen.queryByText(
          'This hackathon does not exist. Please create a new hackathon.'
        )
      ).toBeInTheDocument();
      expect(
        screen.queryByText('Failed to fetch hackathon. Please try again later.')
      ).not.toBeInTheDocument();
    });
  });

  it('should show correct error message for fetch error', async () => {
    renderWithRouterAndProvider(
      <Routes>
        <Route
          path={hackathonRouteForTesting}
          element={<HackathonDetails />}
        ></Route>
      </Routes>,
      {
        initialEntries: [hackathonRoute(testHackathonId.networkError)],
      }
    );

    await waitFor(() => {
      expect(
        screen.queryByText('Failed to fetch hackathon. Please try again later.')
      ).toBeInTheDocument();
      expect(
        screen.queryByText(
          'This hackathon does not exist. Please create a new hackathon.'
        )
      ).not.toBeInTheDocument();
    });
  });
});
