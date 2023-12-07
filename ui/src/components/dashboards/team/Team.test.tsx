import { act, fireEvent, screen, waitFor } from '@testing-library/react';
import { UserRole } from '~/enums/UserRole';
import {
  getConnectedStateConnectedResponseHandler,
  getConnectedStateUnauthorizedResponseHandler,
  getConnectedStateWaitingResponseHandler,
} from '~/mocks/handlers/remoteBot';
import { server } from '~/mocks/server';
import {
  testHackathonBody,
  validTeamCredentials,
} from '~/mocks/test-data/hackathon';
import { removeMilestoneBotPrefix } from '~/utils/milestone-utils';
import { renderWithRouterAndProvider } from '~/utils/test-utils';

import Team from './Team';

describe('Team', () => {
  const hackathonMilestoneBot = removeMilestoneBotPrefix(
    testHackathonBody.currentMilestoneClassName
  );
  const hackathonMap = testHackathonBody.currentMilestoneMap;

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
    expect(screen.getByText('Disconnected')).toBeInTheDocument();
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
          credentials: validTeamCredentials.credentials,
        },
      },
    });

    const currentMilestone = await screen.findByText(
      `Map: ${hackathonMap} - Bot: ${hackathonMilestoneBot}`
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

  it('should disable the Add Game button when bot is not connected', () => {
    renderWithRouterAndProvider(<Team />);

    const addANewGameButton = screen.getByRole('button', {
      name: 'Add a new game',
    });

    const refreshButton = screen.getByRole('button', {
      name: 'Refresh',
    });

    const connectButton = screen.getByRole('button', {
      name: 'Connect',
    });

    expect(refreshButton).toBeInTheDocument();
    expect(connectButton).toBeInTheDocument();
    expect(addANewGameButton).toBeInTheDocument();
    expect(addANewGameButton).toHaveAttribute('disabled');
  });

  it('should display waiting message when refresh button clicked before connection', async () => {
    server.use(getConnectedStateWaitingResponseHandler);

    renderWithRouterAndProvider(<Team />, {
      preloadedState: {
        auth: {
          name: 'Team1',
          role: UserRole.TEAM,
          credentials: validTeamCredentials.credentials,
        },
      },
    });

    const addANewGameButton = screen.getByRole('button', {
      name: 'Add a new game',
    });

    const refreshButton = screen.getByRole('button', {
      name: 'Refresh',
    });

    expect(addANewGameButton).toBeInTheDocument();
    expect(refreshButton).toBeInTheDocument();

    act(() => {
      fireEvent.click(refreshButton);
    });

    await waitFor(() => {
      expect(
        screen.getByText('Waiting for you to start your bot')
      ).toBeInTheDocument();
      expect(addANewGameButton).toHaveAttribute('disabled');
    });
  });

  it('should display connected message when refresh button clicked and bot is connected', async () => {
    server.use(getConnectedStateConnectedResponseHandler);

    renderWithRouterAndProvider(<Team />, {
      preloadedState: {
        auth: {
          name: 'Team1',
          role: UserRole.TEAM,
          credentials: validTeamCredentials.credentials,
        },
      },
    });

    const addANewGameButton = screen.getByRole('button', {
      name: 'Add a new game',
    });

    const refreshButton = screen.getByRole('button', {
      name: 'Refresh',
    });

    expect(addANewGameButton).toBeInTheDocument();
    expect(refreshButton).toBeInTheDocument();

    act(() => {
      fireEvent.click(refreshButton);
    });

    await waitFor(() => {
      expect(screen.getByText('Connected')).toBeInTheDocument();
      expect(addANewGameButton).not.toHaveAttribute('disabled');
    });
  });

  it('should display connected message when Connect button clicked and bot is connected', async () => {
    server.use(getConnectedStateConnectedResponseHandler);

    renderWithRouterAndProvider(<Team />, {
      preloadedState: {
        auth: {
          name: 'Team1',
          role: UserRole.TEAM,
          credentials: validTeamCredentials.credentials,
        },
      },
    });

    const addANewGameButton = screen.getByRole('button', {
      name: 'Add a new game',
    });

    const connectButton = screen.getByTestId('connectButton');

    expect(addANewGameButton).toBeInTheDocument();
    expect(connectButton).toBeInTheDocument();

    act(() => {
      fireEvent.click(connectButton);
    });

    await waitFor(() => {
      expect(screen.getByText('Connected')).toBeInTheDocument();
      expect(addANewGameButton).not.toHaveAttribute('disabled');
      expect(connectButton).toHaveTextContent('Disconnect');
    });
  });

  it('should force logout if the team is no longer authorised (e.g. deleted)', async () => {
    server.use(getConnectedStateUnauthorizedResponseHandler);

    const { store } = renderWithRouterAndProvider(<Team />, {
      preloadedState: {
        auth: {
          name: 'Team1',
          role: UserRole.TEAM,
          credentials: validTeamCredentials.credentials,
        },
      },
    });

    const addANewGameButton = screen.getByRole('button', {
      name: 'Add a new game',
    });

    const connectButton = screen.getByTestId('connectButton');

    expect(addANewGameButton).toBeInTheDocument();
    expect(connectButton).toBeInTheDocument();

    act(() => {
      fireEvent.click(connectButton);
    });

    await waitFor(() => {
      const reduxState = store.getState();
      expect(reduxState.auth.role).toBeNull();
    });
  });
});
