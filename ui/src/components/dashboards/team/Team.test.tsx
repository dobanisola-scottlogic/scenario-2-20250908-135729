import { screen } from '@testing-library/react';

import { UserRole } from '../../../enums/UserRole';
import { renderWithRouterAndProvider } from '../../../utils/test-utils';
import Team from './Team';

describe('Team', () => {
  it('should render the Team dashboard component correctly', () => {
    renderWithRouterAndProvider(<Team />);

    const addANewGameButton = screen.getByRole('button', {
      name: 'Add a new game',
    });

    expect(screen.getByText('Current Milestone:')).toBeInTheDocument();
    expect(
      screen.getByText(
        'To view the information needed to access your development environment, click here:'
      )
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'View information' })
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        'To connect your bot, click on the connect button and then start your bot:'
      )
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Connect' })).toBeInTheDocument();
    expect(screen.getByText('Status: Disconnected')).toBeInTheDocument();
    expect(addANewGameButton).toBeInTheDocument();
    expect(addANewGameButton).toHaveAttribute('disabled');
    expect(screen.getByText('Placeholder for games table')).toBeInTheDocument();
  });

  it('should display the correct current milestone for the logged-in team', async () => {
    renderWithRouterAndProvider(<Team />, {
      preloadedState: {
        auth: {
          name: 'team',
          role: UserRole.TEAM,
          credentials: 'team',
        },
      },
    });

    const currentMilestone = await screen.findByText(
      'Map: Easy - Bot: Milestone1Bot'
    );
    expect(currentMilestone).toBeInTheDocument();
  });

  it('should show error message when current milestone fails to fetch', async () => {
    renderWithRouterAndProvider(<Team />);

    const currentMilestone = await screen.findByText(
      'Failed to fetch current milestone.'
    );
    expect(currentMilestone).toBeInTheDocument();
  });
});
