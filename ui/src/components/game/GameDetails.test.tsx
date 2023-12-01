import { screen } from '@testing-library/react';
import { renderWithRouterAndProvider } from '~/utils/test-utils';
import GameDetails from './GameDetails';

describe('GameDetails', () => {
  it('should render the game viewer with the expected components', () => {
    renderWithRouterAndProvider(<GameDetails />);

    // Addition for code coverage should be replaced as elements are implemented
    expect(screen.getByText('Map details')).toBeInTheDocument();
    expect(
      screen.getByText('Player details (p1 vs p2) placeholder')
    ).toBeInTheDocument();
    expect(screen.getByText('Date time details')).toBeInTheDocument();
  });
});
