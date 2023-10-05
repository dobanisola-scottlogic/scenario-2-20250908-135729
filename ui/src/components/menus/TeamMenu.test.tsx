import { fireEvent, screen } from '@testing-library/react';

import { renderWithRouterAndProvider } from '../../utils/test-utils';
import TeamMenu from './TeamMenu';

describe('TeamMenu', () => {
  beforeEach(() => {
    renderWithRouterAndProvider(<TeamMenu selectedTeamId="test-id" />);
  });

  it('should open the Delete popup on delete', () => {
    fireEvent.click(screen.getByRole('button', { name: 'more' }));
    fireEvent.click(screen.getByRole('menuitem', { name: 'Delete...' }));

    expect(
      screen.getByText('Are you sure you want to delete the team?')
    ).toBeInTheDocument();
  });
});
