import { fireEvent, screen } from '@testing-library/react';

import { renderWithRouterAndProvider } from '~/utils/test-utils';
import GameResultList from './GameResultList';

describe('GameResultList', () => {
  beforeEach(() => {
    renderWithRouterAndProvider(<GameResultList hackathonId='hackathonId' />);
  });

  it('should render the GameResultList component correctly', () => {
    expect(
      screen.getByRole('button', { name: 'Add a new game' })
    ).toBeInTheDocument();

    expect(screen.getByLabelText('List of games')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Add a new game' }));
    expect(screen.getAllByText('Add a new game')).toHaveLength(3);
  });
});
