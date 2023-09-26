import { fireEvent, screen } from '@testing-library/react';
import { renderWithRouterAndProvider } from '../../utils/test-utils';
import HackathonMenu from './HackathonMenu';

describe('HackathonMenu', () => {
  beforeEach(() => {
    renderWithRouterAndProvider(
      <HackathonMenu selectedHackathonId="test-id" />
    );
  });

  it('should open the delete popup on delete', () => {
    fireEvent.click(screen.getByRole('button', { name: 'more' }));
    fireEvent.click(screen.getByRole('menuitem', { name: 'Delete...' }));

    expect(
      screen.getByText('Are you sure you want to delete the hackathon?')
    ).toBeInTheDocument();
  });

  it('should open the edit popup on edit', () => {
    fireEvent.click(screen.getByRole('button', { name: 'more' }));
    fireEvent.click(screen.getByRole('menuitem', { name: 'Edit...' }));

    expect(screen.getByText('Edit hackathon')).toBeInTheDocument();
  });
});
