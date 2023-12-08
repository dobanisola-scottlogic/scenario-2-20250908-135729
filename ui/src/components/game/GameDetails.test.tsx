import { screen } from '@testing-library/react';
import { testGameResultBody } from '~/mocks/test-data/game';
import { renderWithRouterAndProvider } from '~/utils/test-utils';
import GameDetails from './GameDetails';

describe('GameDetails', () => {
  it('should render the game viewer with the expected components', () => {
    renderWithRouterAndProvider(<GameDetails game={testGameResultBody.game} />);

    expect(screen.getByText('Map: Easy')).toBeInTheDocument();
    expect(screen.getByText('Milestone1Bot')).toBeInTheDocument();
    expect(screen.getByText('vs')).toBeInTheDocument();
    expect(screen.getByText('Milestone2Bot')).toBeInTheDocument();
    expect(screen.getByText('Fri, 09:12:34')).toBeInTheDocument();
  });
});
