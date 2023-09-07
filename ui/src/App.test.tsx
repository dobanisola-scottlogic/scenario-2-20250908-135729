import { screen } from '@testing-library/react';
import App from './App';
import { UserRole } from './enums/UserRole';
import { renderWithProviders } from './utils/test-utils';

describe('App Component', () => {
  it('renders the Login component when userRole is null', () => {
    renderWithProviders(<App />);

    expect(screen.getAllByRole('banner')[1]).toHaveTextContent('Hackathon');
    expect(screen.getByRole('heading', { name: 'Login' })).toBeInTheDocument();
  });

  it('renders the Admin component when userRole is ADMIN', () => {
    renderWithProviders(<App />, {
      preloadedState: {
        auth: { name: 'admin', role: UserRole.ADMIN, credentials: '' },
      },
    });

    expect(screen.getAllByRole('banner')[1]).toHaveTextContent('Hackathon');
    expect(screen.getByRole('heading', { name: 'Admin' })).toBeInTheDocument();
  });

  it('renders the Team component when userRole is TEAM', () => {
    renderWithProviders(<App />, {
      preloadedState: {
        auth: { name: 'team', role: UserRole.TEAM, credentials: '' },
      },
    });

    expect(screen.getAllByRole('banner')[1]).toHaveTextContent('Hackathon');
    expect(
      screen.getByRole('heading', { name: 'Team: team' })
    ).toBeInTheDocument();
  });
});
