import { screen } from '@testing-library/react';
import { UserRole } from '~/enums/UserRole';
import { testGameId } from '~/mocks/test-data/game';
import { testHackathonId } from '~/mocks/test-data/hackathon';
import { renderWithRouterAndProvider } from '~/utils/test-utils';
import { hackathonGameRoute, hackathonRoute } from './Routes';
import Routing from './Routing';

describe('Routing', () => {
  const hackathonId = testHackathonId.valid;

  it('renders the Login component when userRole is null', () => {
    renderWithRouterAndProvider(<Routing />);

    expect(screen.getByRole('heading', { name: 'Login' })).toBeInTheDocument();
  });

  it('renders the HackathonList component when userRole is ADMIN', () => {
    renderWithRouterAndProvider(<Routing />, {
      preloadedState: {
        auth: { name: 'admin', role: UserRole.ADMIN, credentials: '' },
      },
    });

    expect(
      screen.getByRole('button', { name: 'Add a new hackathon' })
    ).toBeInTheDocument();
  });

  it('renders the Team component when userRole is TEAM', () => {
    renderWithRouterAndProvider(<Routing />, {
      preloadedState: {
        auth: { name: 'team', role: UserRole.TEAM, credentials: '' },
      },
    });

    expect(
      screen.getByRole('button', { name: 'View information' })
    ).toBeInTheDocument();
  });

  it('renders the HackathonDetails component when userRole is ADMIN and url is a specified hackathon ID', async () => {
    renderWithRouterAndProvider(<Routing />, {
      preloadedState: {
        auth: { name: 'admin', role: UserRole.ADMIN, credentials: '' },
      },
      initialEntries: [hackathonRoute(hackathonId)],
    });

    expect(
      await screen.findByRole('link', { name: 'Hackathons' })
    ).toBeInTheDocument();
  });

  it('renders the GameViewer component when userRole is ADMIN and url is a specified hackathon ID with game ID', async () => {
    renderWithRouterAndProvider(<Routing />, {
      preloadedState: {
        auth: { name: 'admin', role: UserRole.ADMIN, credentials: '' },
      },
      initialEntries: [hackathonGameRoute(hackathonId, testGameId.valid)],
    });

    expect(
      await screen.findByRole('link', { name: 'Hackathons' })
    ).toBeInTheDocument();
    expect(
      screen.getByText('Milestone1Bot vs Milestone2Bot')
    ).toBeInTheDocument();
  });

  it('redirects the user back to landing page when userRole is not ADMIN and url is a specified hackathon ID', () => {
    renderWithRouterAndProvider(<Routing />, {
      initialEntries: [hackathonRoute(hackathonId)],
    });

    expect(screen.getByRole('heading', { name: 'Login' })).toBeInTheDocument();
  });
});
