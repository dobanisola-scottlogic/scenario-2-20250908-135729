import { screen } from '@testing-library/react';
import { Route, Routes } from 'react-router-dom';
import GameViewer from '~/components/game/GameViewer';
import { testGameId } from '~/mocks/test-data/game';
import {
  testHackathonBody,
  testHackathonId,
} from '~/mocks/test-data/hackathon';
import { gameRouteForTesting, hackathonGameRoute } from '~/routing/Routes';
import { removeMilestoneBotPrefix } from '~/utils/milestone-utils';
import { renderWithRouterAndProvider } from '~/utils/test-utils';

describe('GameViewer', () => {
  const hackathonName = testHackathonBody.name;
  const hackathonMap = testHackathonBody.currentMilestoneMap;
  const hackathonMilestoneBot = removeMilestoneBotPrefix(
    testHackathonBody.currentMilestoneClassName
  );

  it('should render the game viewer with the game ID specified in the url path', async () => {
    renderWithRouterAndProvider(
      <Routes>
        <Route path={gameRouteForTesting} element={<GameViewer />}></Route>
      </Routes>,
      {
        initialEntries: [
          hackathonGameRoute(testHackathonId.valid, testGameId.valid),
        ],
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
      screen.getByText('Milestone1Bot vs Milestone2Bot')
    ).toBeInTheDocument();
  });

  it('should render the game viewer with the expected components', async () => {
    renderWithRouterAndProvider(
      <Routes>
        <Route path={gameRouteForTesting} element={<GameViewer />}></Route>
      </Routes>,
      {
        initialEntries: [
          hackathonGameRoute(testHackathonId.valid, testGameId.valid),
        ],
      }
    );

    expect(await screen.findByText(hackathonName)).toBeInTheDocument();

    // Addition for code coverage should be replaced as elements are implemented
    expect(screen.getByText('Playback placeholder')).toBeInTheDocument();
    expect(
      screen.getByText('Player count chart placeholder')
    ).toBeInTheDocument();
    expect(
      screen.getByText('Collectables chart placeholder')
    ).toBeInTheDocument();
  });

  it('should render the game viewer with an error message if a bad request occurs', async () => {
    renderWithRouterAndProvider(
      <Routes>
        <Route path={gameRouteForTesting} element={<GameViewer />}></Route>
      </Routes>,
      {
        initialEntries: [
          hackathonGameRoute(testHackathonId.valid, testGameId.badRequest),
        ],
      }
    );

    expect(
      await screen.findByText('Failed to fetch data. Please try again later.')
    ).toBeInTheDocument();
  });

  it('should render the game viewer with an error message if a network error occurs', async () => {
    renderWithRouterAndProvider(
      <Routes>
        <Route path={gameRouteForTesting} element={<GameViewer />}></Route>
      </Routes>,
      {
        initialEntries: [
          hackathonGameRoute(testHackathonId.valid, testGameId.networkError),
        ],
      }
    );

    expect(
      await screen.findByText('Failed to fetch data. Please try again later.')
    ).toBeInTheDocument();
  });
});
