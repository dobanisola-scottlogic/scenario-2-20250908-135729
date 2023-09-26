import { screen } from '@testing-library/react';
import { UserRole } from '../enums/UserRole';
import { renderWithRouterAndProvider } from '../utils/test-utils';
import Routing from './Routing';

describe('Routing', () => {
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
      screen.getByRole('heading', { name: 'Team: team' })
    ).toBeInTheDocument();
  });

  it('renders the HackathonDetails component when userRole is ADMIN and url is a specified hackathon ID', () => {
    renderWithRouterAndProvider(<Routing />, {
      preloadedState: {
        auth: { name: 'admin', role: UserRole.ADMIN, credentials: '' },
      },
      initialEntries: ['/test-id'],
    });

    expect(screen.getByText('test-id')).toBeInTheDocument();
  });

  it('redirects the user back to landing page when userRole is not ADMIN and url is a specified hackathon ID', () => {
    renderWithRouterAndProvider(<Routing />, {
      initialEntries: ['/test-id'],
    });

    expect(screen.getByRole('heading', { name: 'Login' })).toBeInTheDocument();
  });
});
