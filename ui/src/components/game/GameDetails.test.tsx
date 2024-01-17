import { screen } from '@testing-library/react';
import {
  testGameResultBody,
  testGameResultBodyUserTeams,
} from '~/mocks/test-data/game';
import { renderWithRouterAndProvider } from '~/utils/test-utils';
import GameDetails from './GameDetails';

describe('GameDetails', () => {
  it('should render the game viewer with the expected components', () => {
    renderWithRouterAndProvider(<GameDetails game={testGameResultBody.game} />);

    expect(screen.getByTestId('bot-10')).toBeInTheDocument();
    expect(screen.getByTestId('bot-10')).toHaveTextContent('Milestone1Bot');

    expect(screen.getByTestId('bot-9')).toBeInTheDocument();
    expect(screen.getByTestId('bot-9')).toHaveTextContent('vs Milestone2Bot');

    expect(screen.getByText('Map: Easy')).toBeInTheDocument();
    expect(screen.getByText('Fri, 09:12:34')).toBeInTheDocument();
  });

  it('should render the game viewer with expected components with user-created teams', () => {
    renderWithRouterAndProvider(
      <GameDetails game={testGameResultBodyUserTeams.game} />
    );
    expect(screen.getByTestId('team-Team1')).toBeInTheDocument();
    expect(screen.getByTestId('team-Team1')).toHaveTextContent('Team 1');

    expect(screen.getByTestId('team-Team2')).toBeInTheDocument();
    expect(screen.getByTestId('team-Team2')).toHaveTextContent('Team 2');

    expect(screen.getByText('Map: Easy')).toBeInTheDocument();
    expect(screen.getByText('Fri, 09:12:34')).toBeInTheDocument();
  });
});
