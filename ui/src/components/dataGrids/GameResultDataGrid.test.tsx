import { screen } from '@testing-library/react';

import { getGameResultsNetworkErrorResponseHandler } from '~/mocks/handlers/game';
import { server } from '~/mocks/server';
import { testGameResultBody } from '~/mocks/test-data/game';
import { testHackathonId } from '~/mocks/test-data/hackathon';
import { getGameTimeString } from '~/utils/game-utils';
import { removeMilestoneBotPrefix } from '~/utils/milestone-utils';
import { renderWithRouterAndProvider } from '~/utils/test-utils';
import GameResultDataGrid from './GameResultDataGrid';

describe('GameResultDataGrid', () => {
  const hackathonId = testHackathonId.valid;
  const gameTeam1 = removeMilestoneBotPrefix(
    testGameResultBody.game.teams[0].teamName
  );
  const gameTeam2 = removeMilestoneBotPrefix(
    testGameResultBody.game.teams[1].teamName
  );
  const gameMap = testGameResultBody.game.arena.name;
  const gameTime = getGameTimeString(testGameResultBody.game.gameTime);

  it('should render the table correctly after successful data fetch', async () => {
    renderWithRouterAndProvider(
      <GameResultDataGrid hackathonId={hackathonId} />
    );

    expect(screen.getByLabelText('List of games')).toBeInTheDocument();

    const teamsColumnHeader = await screen.findByRole('columnheader', {
      name: 'Teams',
    });
    const mapColumnHeader = await screen.findByRole('columnheader', {
      name: 'Map',
    });
    const startTimeColumnHeader = await screen.findByRole('columnheader', {
      name: 'Start Time',
    });

    const teamCellRow1 = await screen.findByRole('cell', {
      name: `${gameTeam1} vs ${gameTeam2}`,
    });

    const mapCellRow1 = await screen.findByRole('cell', {
      name: gameMap,
    });

    const startTimeCellRow1 = await screen.findByRole('cell', {
      name: gameTime,
    });

    expect(teamsColumnHeader).toBeInTheDocument();
    expect(mapColumnHeader).toBeInTheDocument();
    expect(startTimeColumnHeader).toBeInTheDocument();

    expect(teamCellRow1).toBeInTheDocument();
    expect(mapCellRow1).toBeInTheDocument();
    expect(startTimeCellRow1).toBeInTheDocument();
  });

  it('should display an error message after unsuccessful data fetch', async () => {
    server.use(getGameResultsNetworkErrorResponseHandler);

    renderWithRouterAndProvider(
      <GameResultDataGrid hackathonId={hackathonId} />
    );

    const error = await screen.findByText(
      'Failed to fetch games. Please try again later.'
    );

    expect(error).toBeInTheDocument();
  });
});
